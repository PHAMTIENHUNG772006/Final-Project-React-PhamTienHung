import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ModalAddTask from "../../components/ModalAddTask";
import ModalDeleteTask from "../../components/ModalDeleteTask";
import ModalAddEployee from "../../components/ModalAddEployee";
import ModalListEmp from "../../components/ModalListEmp";
import ProjectAddEmploye from "./ProjectAddEmploye";
import ListTask from "./ListTask";
import type { ProjectMember, Task } from "../../interfaces/interface";
import type Project from "../../interfaces/interface";
import type { AppDispatch, RootState } from "../../redux/stores";
import {
  addTask,
  deleteTask,
  featchTask,
  updateTask,
} from "../../redux/slices/TaskSlice";
import {
  addMember,
  deleteMember,
  featchProjects,
  updateMember,
} from "../../redux/slices/ProjectSlice";

export default function ProjectDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { id } = useParams<{ id: string }>();

  // =================== Modal: Task ===================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modle, setModal] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // =================== Modal: Delete Task ===================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // =================== Modal: Employee ===================
  const [isModalOpenEmp, setIsModalOpenEmp] = useState(false);
  const [isModalOpenEmpList, setIsModalOpenEmpList] = useState(false);

  // =================== Search + Sort ===================
  const [word, setWord] = useState("");
  const [sortValue, setSortValue] = useState<string>("");

  useEffect(() => {
    dispatch(featchTask());
  }, [dispatch]);

  // =================== Task CRUD ===================
  const showAddModal = () => {
    setModal("add");
    setIsModalOpen(true);
  };

  const showEditModal = (task: Task) => {
    setModal("edit");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalOk = async (task: Task) => {
    if (modle === "add") {
      await dispatch(addTask(task));
    } else {
      await dispatch(updateTask(task));
    }
    await dispatch(featchTask());
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // =================== Delete Task ===================
  const showDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete.id));
      await dispatch(featchTask());
    }
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // =================== Employee ===================
  const showAddModalEmp = () => setIsModalOpenEmp(true);
  const handleModalEmpCancel = () => setIsModalOpenEmp(false);

  const handleModalOkEmp = (project: Project, member: ProjectMember) => {
    dispatch(addMember({ project, member }));
    setIsModalOpenEmp(false);
  };
  // modal dach sách nhân viên ở trong dự án
  const showModalListEmp = () => setIsModalOpenEmpList(true);
  const handleCancelListEmp = () => setIsModalOpenEmpList(false);

  const handleModalDeleteEmp = async (
    project: Project,
    member: ProjectMember
  ) => {
    await dispatch(deleteMember({ project, member }));
    await dispatch(featchProjects());
  };

  const handleModalUpdateEmp = async (
    project: Project,
    member: ProjectMember
  ) => {
    await dispatch(updateMember({ project, member }));
    await dispatch(featchProjects());
  };

  // =================== Search & Sort ===================
  const handleSearch = (keyWord: string) => setWord(keyWord);
  const handleSort = (value: string) => setSortValue(value);

  // =================== Filter & Sort Tasks ===================
  const foundTaskInProject = tasks.filter(
    (task) => task.projectId === String(id)
  );

  const filteredTasks = foundTaskInProject
    .filter((task) =>
      task.taskName.toLowerCase().includes(word.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (sortValue === "deadline") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      if (sortValue === "priority") {
        const priorityOrder: Record<Task["priority"], number> = {
          Cao: 1,
          "Trung bình": 2,
          Thấp: 3,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });

  // =================== Render ===================
  return (
    <>
      <ProjectAddEmploye
        showListEmp={showModalListEmp}
        showAddModalEmp={showAddModalEmp}
        showAddModal={showAddModal}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <ListTask
        tasks={filteredTasks}
        showEditModal={showEditModal}
        showDeleteModal={showDeleteModal}
      />
      {/* Các modal khác */}
      <ModalAddTask
        open={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        modle={modle}
        initial={selectedTask ?? undefined}
      />
      <ModalDeleteTask
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        TaskName={taskToDelete?.taskName}
      />
      <ModalAddEployee
        open={isModalOpenEmp}
        onCancel={handleModalEmpCancel}
        onOk={handleModalOkEmp}
      />
      <ModalListEmp
        onCancel={handleCancelListEmp}
        open={isModalOpenEmpList}
        onDelete={handleModalDeleteEmp}
        onUpdate={handleModalUpdateEmp}
        onReload={() => dispatch(featchProjects())}
      />
      
    </>
  );
}
