import { useOutletContext } from "react-router-dom";
import ProjectsAddFilter from "./ProjectsAddFilter";
import ProjectsList from "./ProjectsList";
import type Project from "../../interfaces/interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/stores";
import { featchProjects } from "../../redux/slices/ProjectSlice";
import { Spin } from "antd";

interface ProjectManagerContext {
  showAddModal: () => void;
  showDeleteModal: (project: Project) => void;
  showEditModal: (project: Project) => void;
}

export default function ProjectsHome() {
  const { showAddModal, showDeleteModal, showEditModal } =
    useOutletContext<ProjectManagerContext>();
  const [word, setWord] = useState("");
  const handleSearch = (word: string) => {
    setWord(word);
  };
  const { projects, status } = useSelector(
    (state: RootState) => state.projects
  );

  
  const userLogin = JSON.parse(localStorage.getItem("userLogin") || "{}");

  const findProject = projects.filter(
    (project) => project.idOwner === userLogin.id
  );
  const filteredProjects = findProject.filter((project) =>
    project.projectName.toLowerCase().includes(word.toLowerCase())
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(featchProjects());
  }, [dispatch]);


  return (
    <div className="table-container">
      <ProjectsAddFilter onSearch={handleSearch} showModal={showAddModal} />
      <ProjectsList
        projects={filteredProjects}
        showModalDelete={showDeleteModal}
        showModalEdit={showEditModal}
      />

       {
       (status === "pending" && 
         <div className="spiner">
          <Spin
          tip="Đang tải dữ liệu..."
          size="large"
        ></Spin>
         </div>
       )
     }
    </div>
  );
}
