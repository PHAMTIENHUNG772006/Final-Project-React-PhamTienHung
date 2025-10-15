import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/stores";
import { useEffect, useState, type ChangeEvent } from "react";
import { featchTask, updateStatus } from "../../redux/slices/TaskSlice";
import { featchProjects } from "../../redux/slices/ProjectSlice";
import ModalUpdateStatus from "../../components/ModalUpdateStatus";
import type { Task } from "../../interfaces/interface";

export default function MyTasks() {
  const userLogin = JSON.parse(localStorage.getItem("userLogin") || "{}");
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const dispatch = useDispatch<AppDispatch>();
  const [word,setWord] = useState("");
  const [sort,setSort] = useState("");

  const [isUpdateStatus,setIsUpdateStatus] = useState(false);
  const [taskToUpdate,setTaskToUpdate] =  useState<Task | null>(null)

  useEffect(() => {
    dispatch(featchTask());
    dispatch(featchProjects());
  }, [dispatch]);

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  // Lọc task của user
  const myTasks = tasks.filter((task) => task.assigneeId === userLogin.id);

  // Lọc project có task của user
  const myProjects = projects.filter((p) =>
    myTasks.some((t) => t.projectId === p.id)
  );

  // Gom task theo project
  const groupedTasks = myProjects.map((project) => ({
    ...project,
    tasks: myTasks.filter((t) => t.projectId === project.id),
  }));

  const filteredGroudTask = groupedTasks.map((project) => ({
    ...project,
    tasks : project.tasks.filter((task) => task.taskName.toLowerCase().includes(word.toLowerCase()))
  }))

  const sortedGroupedTasks = filteredGroudTask.map((project) => {
  const sortedTasks = [...project.tasks];

  if (sort === "date") {
    sortedTasks.sort(
      (a, b) => new Date(a.asigndate).getTime() - new Date(b.asigndate).getTime()
    );
  } else if (sort === "priority") {
    const priorityOrder: Record<string, number> = {
      "Cao": 1,
      "Trung bình": 2,
      "Thấp": 3,
    };
    sortedTasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  return { ...project, tasks: sortedTasks };
});

  const toggleTask = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (e : ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value)
  }

   const handleSearch = (e : ChangeEvent<HTMLInputElement>) => {
      setWord(e.target.value)
  }

    // =================== Delete Task ===================
  const showStatusModal = (task: Task) => {
    setTaskToUpdate(task);
    setIsUpdateStatus(true);
  };

  const handleUpdateOk = async () => {
    if (taskToUpdate) {
      await dispatch(updateStatus(taskToUpdate));
      await dispatch(featchTask());
    }
    setIsUpdateStatus(false);
  };

  const handleUpdateCancel = () => {
    setIsUpdateStatus(false);
  };

  return (
    <div className="body">
      <h2>Quản lý nhiệm vụ</h2>

      <div className="header-container-MyTask">
        <div className="filterSearch">
          <select onChange={handleSort} className="select">
            <option value="">Sắp xếp theo</option>
            <option value="date">Sắp xếp ngày tháng</option>
            <option value="priority">Sắp xếp theo tiến độ</option>
          </select>
          <input
          onChange={handleSearch}
            className="input"
            type="text"
            placeholder="Nhập task cần tìm.."
          />
        </div>
      </div>

      <div className="body-my-task">
        <h2>Danh sách nhiệm vụ</h2>

        <table>
          <thead>
            <tr>
              <th>Tên nhiệm vụ</th>
              <th>Độ ưu tiên</th>
              <th>Trạng thái</th>
              <th>Ngày bắt đầu</th>
              <th>Hạn chót</th>
              <th>Tiến độ</th>
            </tr>
          </thead>

          <tbody className="bodyTask">
            {sortedGroupedTasks.flatMap((project) => {
              const rows = [];

              // Hàng tiêu đề project
              rows.push(
                <tr
                  key={project.id}
                  onClick={() => toggleTask(project.id)}
                  className="row"
                  style={{
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <td colSpan={6} style={{ color: "#000" }}>
                    {open[project.id] ? (
                <span className="status-Task">▼</span>
              ) : (
                <span className="status-Task">▶</span>
              )}{" "}
              <span className="status-Task">{project.projectName}</span>
                  </td>
                </tr>
              );

              // Nếu đang mở => hiển thị task
              if (open[project.id]) {
                if (project.tasks.length > 0) {
                  project.tasks.forEach((task) => {
                    rows.push(
                      <tr className="row" key={task.id}>
                        <td>{task.taskName}</td>

                        <td style={{ textAlign: "center", fontWeight: "600" }} className="status-task">
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

                        <td style={{ textAlign: "center" }}>
                          {task.status}
                          <img
                          onClick={() => {showStatusModal(task)}}
                            style={{ paddingLeft: "7px" }}
                            src="../../src/assets/icons/Vector.png"
                            alt=""
                          />
                        </td>

                        <td style={{ textAlign: "center" }} className="date">
                          {task.asigndate}
                        </td>

                        <td style={{ textAlign: "center" }} className="date">
                          {task.dueDate}
                        </td>

                        <td style={{ textAlign: "center" }}>
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
                      </tr>
                    );
                  });
                } else {
                  rows.push(
                    <tr key={project.id + "-empty"}>
                      <td
                        colSpan={6}
                        style={{
                          fontStyle: "italic",
                          color: "#888",
                          textAlign: "center",
                        }}
                      >
                        Không thấy nhiệm vụ nào trong dự án này.
                      </td>
                    </tr>
                  );
                }
              }

              return rows;
            })}
          </tbody>
        </table>
      </div>
      <ModalUpdateStatus
       open={isUpdateStatus}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      ></ModalUpdateStatus>
    </div>
  );
}
