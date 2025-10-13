import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type Project from "../../interfaces/interface";
import type { ProjectMember } from "../../interfaces/interface";

interface ProjectState {
  projects: Project[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: null | string;
}

const initialState: ProjectState = {
  projects: [],
  status: "idle",
  error: null,
};

export const featchProjects = createAsyncThunk(
  "projects/featchProjects",
  async () => {
    const res = await axios.get("http://localhost:8080/projects");
    return res.data;
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (project: Project) => {
    const res = await axios.post("http://localhost:8080/projects", project);
    return res.data;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string) => {
    await axios.delete(`http://localhost:8080/projects/${id}`);
    return id;
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (project: Project) => {
    const res = await axios.put(
      `http://localhost:8080/projects/${project.id}`,
      project
    );
    return res.data;
  }
);

export const addMember = createAsyncThunk(
  "member/addMember",
  async ({ project, member }: { project: Project; member: ProjectMember }) => {
    const res = await axios.get(`http://localhost:8080/projects/${project.id}`);

    const projects = res.data as Project;

    const updateMemberToProject = {
      ...projects,
      members: [...(projects.members || []), member],
    };

    const updateRes = await axios.put(
      `http://localhost:8080/projects/${project.id}`,
      updateMemberToProject
    );

    return updateRes.data;
  }
);



export const deleteMember = createAsyncThunk(
  "member/deleteMember",
  async ({ project, member }: { project: Project; member: ProjectMember }) => {
    const res = await axios.get(`http://localhost:8080/projects/${project.id}`);

    const projects = res.data as Project;

    const deleteMemberToProject = projects.members.filter((m) => m.userId !== member.userId);

    const updateProject = {...projects, members : deleteMemberToProject}

    const updateRes = await axios.put(
      `http://localhost:8080/projects/${project.id}`,
      updateProject
    );

    return updateRes.data;
  }
);


export const updateMember = createAsyncThunk(
  "member/updateMember",
  async ({ project, member }: { project: Project; member: ProjectMember }) => {
    const res = await axios.get(`http://localhost:8080/projects/${project.id}`);
    const projects = res.data as Project;

    const updatedMembers = projects.members.map((m) =>
      m.userId === member.userId ? member : m
    );

    const updatedProject = { ...projects, members: updatedMembers };

    const updateRes = await axios.put(
      `http://localhost:8080/projects/${project.id}`,
      updatedProject
    );

    return updateRes.data;
  }
);


const ProjectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featchProjects.pending, (state) => {
        state.status = "pending";
      })
      .addCase(featchProjects.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.projects = action.payload;
      })
      .addCase(featchProjects.rejected, (state) => {
        state.status = "fulfilled";
        state.error = "Lỗi nhé";
      })
      .addCase(addProject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.projects.push(action.payload);
      })
      .addCase(deleteProject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.projects = state.projects.filter(
          (project) => String(project.id) !== action.payload
        );
      })
      .addCase(addMember.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updateProject = action.payload;
        const index = state.projects.findIndex(
          (project) => project.id === updateProject.id
        );

        state.projects[index] = updateProject;
      });
  },
});

export default ProjectSlice.reducer;
