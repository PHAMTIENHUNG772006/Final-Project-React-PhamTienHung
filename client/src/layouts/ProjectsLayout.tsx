import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalAddProject from "../components/ModalAddProject";
import ModalDelete from "../components/ModalDeleteProject";
import { Outlet } from "react-router-dom";
import type Project from "../interfaces/interface";
import { useDispatch, useSelector } from "react-redux";
import { addProject, deleteProject, updateProject } from "../redux/slices/ProjectSlice";
import type { AppDispatch, RootState } from "../redux/stores";
import { Spin } from "antd";
import { deleteTaskByProject } from "../redux/slices/TaskSlice";

export default function ProjectManager() {
  const dispatch = useDispatch<AppDispatch>();
  const {status} = useSelector((state : RootState) => state.users)

  // ===== Modal thêm/sửa =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // ===== Modal xoá =====
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // ===================== Thêm project =====================
  const showAddModal = () => {
    setMode("add");
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  // ===================== Sửa project =====================
  const showEditModal = (project: Project) => {
    setMode("edit");
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // ===================== Xử lý OK của modal (thêm hoặc sửa) =====================
  const handleModalOk = (project: Project) => {
    if (mode === "add") {
      dispatch(addProject(project));
    } else {
      dispatch(updateProject(project));
    }
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // ===================== Xoá project =====================
  const showDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete.id));
      dispatch(deleteTaskByProject(projectToDelete.id));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div >
      <Header />
      <div className="container-body">
        <div className="main">
          <Outlet
            context={{
              showAddModal,
              showDeleteModal,
              showEditModal,
            }}
          />
        </div>
      </div>
      <Footer />

      {/* ✅ Dùng chỉ 1 modal thêm/sửa */}
      <ModalAddProject
        open={isModalOpen}
        mode={mode}
        initial={selectedProject ?? undefined}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />

      {/* Modal xoá project */}
      <ModalDelete
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        projectName={projectToDelete?.projectName}
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
