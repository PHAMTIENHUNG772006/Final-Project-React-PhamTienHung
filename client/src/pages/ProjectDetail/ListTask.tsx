import { useEffect, useState } from "react";
import { Card } from "antd";
import type { AppDispatch, RootState } from "../../redux/stores";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { featchTask } from "../../redux/slices/TaskSlice";
import type { Task } from "../../interfaces/interface";
import { featchUser } from "../../redux/slices/AuthorsSlice";

interface TaskProps {
  tasks: Task[];
  showDeleteModal: (task: Task) => void;
  showEditModal: (task: Task) => void;
}

export default function ListTask({
  tasks,
  showDeleteModal,
  showEditModal,
}: TaskProps) {
  const [open, setOpen] = useState({
    todo: false,
    progress: false,
    pending: false,
    done: false,
  });
  // đổi trạng thái đóng mở của section
  const toggleSection = (key: "todo" | "progress" | "pending" | "done") => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.users.users);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(featchTask());
    dispatch(featchUser());
  }, [dispatch]);

  
   // lọc để lấy project theo id
  const foundTaskInProject = tasks.filter(
    (task) => task.projectId === String(id)
  );

  const handleDelete = (task: Task) => {
    showDeleteModal(task);
  };

  const handleEdit = (task: Task) => {
    showEditModal(task);
    dispatch(featchTask());
  };
 

  // rendere các task 
  const renderTaskRow = (task: Task) => {
    const assignee = employees.find((emp) => emp.id === task.assigneeId);
    return (
      <tr key={task.id}>
        <td>{task.taskName}</td>
        <td>{assignee ? assignee.fullname : "Không xác định"}</td>
        <td className="status-task">
          <span
            className={`priority ${
              task.priority === "Cao"
                ? "high"
                : task.priority === "Trung bình"
                ? "medium"
                : "low"
            }`}
          >
            {task.priority}
          </span>
        </td>
        <td>{task.asigndate}</td>
        <td>{task.dueDate}</td>
        <td>
          <span
            className={`status ${
              task.progress === "Đúng tiến độ"
                ? "done"
                : task.progress === "Có rủi ro"
                ? "in-progress"
                : "pending"
            }`}
          >
            {task.progress}
          </span>
        </td>

        <td>
          <div className="groud-button">
            <button className="btn-edit" onClick={() => handleEdit(task)}>
              Sửa
            </button>
            <button className="btn-delete" onClick={() => handleDelete(task)}>
              Xóa
            </button>
          </div>
        </td>
      </tr>
    );
  };
  //render ra các trạng thái "todo" | "progress" | "pending" | "done",
  const renderSection = (
    label: string,
    key: "todo" | "progress" | "pending" | "done",
    filterStatus: string
  ) => {
    const filteredTasks = foundTaskInProject.filter(
      (task) => task.status === filterStatus
    );

    return (
      <tbody>
        <tr className="section-header">
          <td colSpan={7}>
            <button
              className="status-button"
              onClick={() => toggleSection(key)}
            >
              {open[key] ? (
                <span className="status-Task">▼</span>
              ) : (
                <span className="status-Task">▶</span>
              )}{" "}
              <span className="status-Task">{label}</span>
            </button>
          </td>
        </tr>

        {open[key] &&
          (filteredTasks.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                Không có nhiệm vụ
              </td>
            </tr>
          ) : (
            filteredTasks.map(renderTaskRow)
          ))}
      </tbody>
    );
  };

  return (
    <Card title="Danh sách nhiệm vụ">
      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Tên Nhiệm Vụ</th>
              <th>Người Phụ Trách</th>
              <th>Ưu Tiên</th>
              <th>Ngày Bắt Đầu</th>
              <th>Hạn Chót</th>
              <th>Tiến độ</th>
              <th>Hành động</th>
            </tr>
          </thead>

          {renderSection("To Do", "todo", "To do")}
          {renderSection("In Progress", "progress", "In Progress")}
          {renderSection("Pending", "pending", "Pending")}
          {renderSection("Done", "done", "Done")}
        </table>
      </div>
    </Card>
  );
}
