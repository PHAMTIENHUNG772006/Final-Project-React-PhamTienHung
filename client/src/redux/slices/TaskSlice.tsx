import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Task } from "../../interfaces/interface";

interface ProjectState {
  tasks: Task[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: null | string;
}

const initialState: ProjectState = {
  tasks: [],
  status: "idle",
  error: null,
};

export const featchTask = createAsyncThunk("tasks/featchTask", async () => {
  const res = await axios.get("http://localhost:8080/tasks");
  return res.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task: Task) => {
  const res = await axios.post("http://localhost:8080/tasks", task);
  return res.data;
});

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    await axios.delete(`http://localhost:8080/tasks/${id}`);
    return id;
  }
);

export const deleteTaskByProject = createAsyncThunk(
  "tasks/deleteTaskByProject",
  async (projectId: string) => {
 
    const res = await axios.get("http://localhost:8080/tasks");
    const allTasks: Task[] = res.data;


    const tasksToDelete = allTasks.filter(task => task.projectId === projectId);


    await Promise.all(
      tasksToDelete.map(task => axios.delete(`http://localhost:8080/tasks/${task.id}`))
    );


    return projectId;
  }
);


export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const res = await axios.put(`http://localhost:8080/tasks/${task.id}`, task);
    return res.data;
  }
);

export const updateStatus = createAsyncThunk(
  "tasks/updateStatus",
  async (task: Task) => {
    const res = await axios.put(`http://localhost:8080/tasks/${task.id}`, task);
    return res.data;
  }
);

const TaskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featchTask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(featchTask.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.tasks = action.payload;
      })
      .addCase(featchTask.rejected, (state) => {
        state.status = "rejected";
        state.error = "Lỗi nhé";
      })
      .addCase(addTask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state) => {
        state.status = "rejected";
        state.error = "Lỗi nhé";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state) => {
        state.status = "rejected";
        state.error = "Lỗi nhé";
      })
      .addCase(deleteTaskByProject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteTaskByProject.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.tasks = state.tasks.filter(
          (task) => task.projectId !== action.payload
        );
      })
      .addCase(deleteTaskByProject.rejected, (state) => {
        state.status = "rejected";
        state.error = "Lỗi nhé";
      })
      .addCase(updateStatus.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updatedTask = action.payload;

        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        }
      })
      .addCase(updateStatus.rejected, (state) => {
        state.status = "rejected";
        state.error = "Lỗi nhé";
      });
  },
});

export default TaskSlice.reducer;
