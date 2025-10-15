import { useEffect, useState } from "react";
import "../css/detailProjetc.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/stores";
import { featchTask } from "../redux/slices/TaskSlice";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  type SelectChangeEvent,
} from "@mui/material";
import type { Task } from "../interfaces/interface";
import { useParams } from "react-router-dom";

interface TaskProps {
  open: boolean;
  onCancel: () => void;
  onOk: (task: Task) => void;
  initial?: Partial<Task>;
  modle: "add" | "edit";
}

export default function ModalAddTask({
  open,
  onCancel,
  onOk,
  initial = {},
  modle = "add",
}: TaskProps) {
  const [form, setForm] = useState<Task>({
    id: "",
    taskName: "",
    assigneeId: "",
    projectId: "",
    asigndate: "",
    dueDate: "",
    priority: "Thấp",
    progress: "",
    status: "To do",
  });

  const [error, setError] = useState({
    taskName: "",
    assigneeId: "",
    projectId: "",
    asigndate: "",
    dueDate: "",
    priority: "",
    progress: "",
    status: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const users = useSelector((state: RootState) => state.users.users);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { id } = useParams<{ id: string }>();
  const foundProject = projects.find((p) => p.id === id);

  const members = foundProject?.members;

  useEffect(() => {
    dispatch(featchTask());
  }, [dispatch]);

  // Nếu đang sửa thì set form bằng dữ liệu ban đầu
useEffect(() => {

  // reset form tùy theo chế độ
  if (modle === "add") {
    setForm({
      id: "",
      taskName: "",
      assigneeId: "",
      projectId: id || "",
      asigndate: "",
      dueDate: "",
      priority: "Thấp",
      progress: "",
      status: "To do",
    });
  } else if (initial && Object.keys(initial).length > 0) {
    // chỉ setForm nếu initial có dữ liệu thật sự
    setForm((prev) => ({ ...prev, ...initial }));
  }

  // reset lỗi mỗi khi mở modal
  setError({
    taskName: "",
    assigneeId: "",
    projectId: "",
    asigndate: "",
    dueDate: "",
    priority: "",
    progress: "",
    status: "",
  });
}, [open, modle, id, JSON.stringify(initial)]);


  if (!members) return null;
    if (!open) return; // chỉ chạy khi modal mở

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const newError = {
    id: "",
    taskName: "",
    assigneeId: "",
    projectId: "",
    asigndate: "",
    dueDate: "",
    priority: "",
    progress: "",
    status: "",
  };

  let isValid = true;

  form.projectId = String(id);
  if (modle === "add") {
    form.id = Date.now().toString();
  }

const findTask = tasks.find(
  (task) =>
    task.taskName.trim().toLowerCase() === form.taskName.trim().toLowerCase() && 
    task.assigneeId === form.assigneeId && 
    (modle === "add" || task.id !== form.id) 
);


  if (!form.taskName.trim()) {
    newError.taskName = "Tên nhiệm vụ không được để trống";
    isValid = false;
  } else if (findTask) {
    newError.taskName = "Tên nhiệm vụ đã có trong hệ thống";
    isValid = false;
  }

if (form.asigndate && form.dueDate) {
  const today = new Date();
  const start = new Date(form.asigndate);
  const end = new Date(form.dueDate);

  // Đặt giờ về 00:00:00 để so sánh chính xác theo ngày (bỏ qua giờ)
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start < today) {
    newError.asigndate = "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại";
    isValid = false;
  }

  if (start > end) {
    newError.dueDate = "Ngày kết thúc phải sau ngày bắt đầu";
    isValid = false;
  }
}


   if (form.taskName.length < 5) {
    newError.taskName = "Tên nhiệm vụ nên chi tiết hơn";
    isValid = false;
  }

  if (!form.assigneeId) {
    newError.assigneeId = "Vui lòng chọn người phụ trách";
    isValid = false;
  }
  if (!form.status) {
    newError.status = "Vui lòng chọn trạng thái";
    isValid = false;
  }
  if (!form.asigndate) {
    newError.asigndate = "Vui lòng chọn ngày bắt đầu";
    isValid = false;
  }
  if (!form.dueDate) {
    newError.dueDate = "Vui lòng chọn hạn cuối";
    isValid = false;
  }
  if (!form.priority) {
    newError.priority = "Vui lòng chọn độ ưu tiên";
    isValid = false;
  }
  if (!form.progress) {
    newError.progress = "Vui lòng chọn tiến độ";
    isValid = false;
  }

  setError(newError);
  if (!isValid) return;

  onOk(form);


  if (modle === "add") {
    setForm({
      id: "",
      taskName: "",
      assigneeId: "",
      projectId: id || "",
      asigndate: "",
      dueDate: "",
      priority: "Thấp",
      progress: "",
      status: "To do",
    });
  }

  onCancel();
};


  const handleCancel = () => {
    setError({
      taskName: "",
      assigneeId: "",
      projectId: "",
      asigndate: "",
      dueDate: "",
      priority: "",
      progress: "",
      status: "",
    });
    onCancel();
  };

  return (
    <div className="overlay">
      <div className="modal-addTask">
        <div className="header-modal">
          <p className="headerAdd addTask">
            {modle === "add" ? "Thêm nhiệm vụ" : "Sửa nhiệm vụ"}
          </p>
          <button onClick={handleCancel} className="close-btn">
            ×
          </button>
        </div>
        <hr />
        <form onSubmit={handleSubmit} className="mainAdd">
          <div className="bodyFormTask">
            
            <TextField
              fullWidth
              label="Tên nhiệm vụ"
              name="taskName"
              value={form.taskName}
              onChange={handleChange}
              error={!!error.taskName}
              helperText={error.taskName}
            />

            
            <FormControl fullWidth error={!!error.assigneeId}>
              <label>Người phụ trách</label>
              <Select
                name="assigneeId"
                value={form.assigneeId}
                onChange={handleChange}
                MenuProps={{ disablePortal: true }}
              >
                {members.map((member) => {
                  const user = users.find((u) => u.id === member.userId);
                  return (
                    <MenuItem key={member.userId} value={member.userId}>
                      {user ? user.fullname : member.userId}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{error.assigneeId}</FormHelperText>
            </FormControl>

            
            <FormControl fullWidth error={!!error.status}>
              <label>Trạng thái</label>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="To do">To do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
              <FormHelperText>{error.status}</FormHelperText>
            </FormControl>

            
            <label>Ngày bắt đầu</label>
            <TextField
              fullWidth
              label="Ngày bắt đầu"
              name="asigndate"
              type="date"
              value={form.asigndate}
              onChange={handleChange}
              error={!!error.asigndate}
              helperText={error.asigndate}
              InputLabelProps={{ shrink: true }}
            />

            
            <label>Ngày kết thúc</label>
            <TextField
              fullWidth
              label="Hạn cuối"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              error={!!error.dueDate}
              helperText={error.dueDate}
              InputLabelProps={{ shrink: true }}
            />

            
            <FormControl fullWidth error={!!error.priority}>
              <label>Độ ưu tiên</label>
              <Select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="Cao">Cao</MenuItem>
                <MenuItem value="Trung bình">Trung bình</MenuItem>
                <MenuItem value="Thấp">Thấp</MenuItem>
              </Select>
              <FormHelperText>{error.priority}</FormHelperText>
            </FormControl>

           
            <FormControl fullWidth error={!!error.progress}>
              <label>Tiến độ</label>
              <Select
                name="progress"
                value={form.progress}
                onChange={handleChange}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="Đúng tiến độ">Đúng tiến độ</MenuItem>
                <MenuItem value="Có rủi ro">Có rủi ro</MenuItem>
                <MenuItem value="Trễ hạn">Trễ hạn</MenuItem>
              </Select>
              <FormHelperText>{error.progress}</FormHelperText>
            </FormControl>
          </div>

          <hr />
          <div className="modal-footer">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Huỷ
            </button>
            <button type="submit" className="save-btn">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
