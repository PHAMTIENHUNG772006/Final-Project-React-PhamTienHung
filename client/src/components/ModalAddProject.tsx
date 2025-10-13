import { useEffect, useState } from "react";
import type Project from "../interfaces/interface";
import type { AppDispatch, RootState } from "../redux/stores";
import { useDispatch, useSelector } from "react-redux";
import { featchProjects } from "../redux/slices/ProjectSlice";
import { TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

interface ModalAddProjectProps {
  open: boolean;
  onOk: (project: Project) => void;
  onCancel: () => void;
  initial?: Partial<Project>;
  mode?: "add" | "edit";
}

export default function ModalAddProject({
  open,
  onOk,
  onCancel,
  initial = {},
  mode = "add",
}: ModalAddProjectProps) {
  const [nameProject, setNameProject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState({ name: "", description: "", image: "" });

  const userLogin = JSON.parse(localStorage.getItem("userLogin") || "null");

  const dispatch = useDispatch<AppDispatch>();
  const {projects} = useSelector((state: RootState) => state.projects);

  // fetch lại danh sách project
  useEffect(() => {
    dispatch(featchProjects());
  }, [dispatch]);

  // reset dữ liệu khi mở modal khi có initial thì lấy data lên modal
  useEffect(() => {
    if (open) {
      setNameProject(initial.projectName ?? "");
      setDescription(initial.description ?? "");
      setPreview(initial.image ?? "");
      setFile(null);
      setError({ name: "", description: "", image: "" });
    }
  }, [initial, open]);

  // === Hàm xử lý lưu ===
  const handleSubmit = async () => {
    const newError = { name: "", description: "", image: "" };
    let hasError = false;

    if (!nameProject.trim()) {
      newError.name = "Tên dự án không được để trống";
      hasError = true;
    } else if (nameProject.length < 5) {
      newError.name = "Tên dự án nên chi tiết hơn";
      hasError = true;
    }

    // Kiểm tra trùng tên (trừ chính nó khi edit)
    const foundProject = projects.find(
      (p) =>
        p.projectName.toLowerCase() === nameProject.toLowerCase() &&
        p.id !== initial?.id
    );
    if (foundProject) {
      newError.name = "Tên dự án đã tồn tại";
      hasError = true;
    }

    // Validate mô tả
    if (!description.trim()) {
      newError.description = "Mô tả không được để trống";
      hasError = true;
    } else if (description.length < 5) {
      newError.description = "Hãy mô tả dự án chi tiết hơn";
      hasError = true;
    }

    // === Upload ảnh nếu có file mới ===
    let imageUrl = preview; // mặc định giữ ảnh cũ
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Project_IT104");
        formData.append("cloud_name", "deyuvrsv9");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/deyuvrsv9/image/upload",
          formData
        );
        imageUrl = response.data.secure_url;
      } catch {
        Swal.fire("Lỗi", "Upload ảnh thất bại", "error");
        return;
      }
    }

    // Validate ảnh chỉ khi thêm mới (mode === "add")
    if (mode === "add" && !imageUrl) {
      newError.image = "Vui lòng chọn file ảnh";
      hasError = true;
    }

    setError(newError);
    if (hasError) return;

    // === Tạo dữ liệu mới ===
    const newProject: Project = {
      id: initial?.id ?? Date.now().toString(),
      projectName: nameProject.trim(),
      idOwner: userLogin.id, 
      description: description.trim(),
      image: imageUrl,
      members: [
        ...(initial?.members ?? []),
        {
          userId: userLogin.userId || userLogin.id, 
          role: "Project Owner"
        },
      ],
    };

    // Gửi về component cha
    onOk(newProject);

    Swal.fire({
      icon: "success",
      title:
        mode === "add"
          ? "Thêm dự án thành công!"
          : "Cập nhật dự án thành công!",
      showConfirmButton: false,
      timer: 2000,
    });

    dispatch(featchProjects());
  };

  if (!open) return null;

  return (
    <div className="overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === "add" ? "Thêm dự án mới" : "Chỉnh sửa dự án"}</h2>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>
        <hr />

        <div className="modal-body">
          <label>Tên dự án</label>
          <TextField
            fullWidth
            error={Boolean(error.name)}
            helperText={error.name}
            value={nameProject}
            onChange={(e) => setNameProject(e.target.value)}
          />

          <label>Ảnh dự án</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFile(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              width="120"
              style={{ marginTop: 10 }}
            />
          )}
          {error.image && <span className="error">{error.image}</span>}

          <label>Mô tả dự án</label>
          <TextField
            fullWidth
            multiline
            rows={3}
            error={Boolean(error.description)}
            helperText={error.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <hr />
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onCancel}>
            Hủy
          </button>
          <button className="save-btn" onClick={handleSubmit}>
            {mode === "add" ? "Lưu" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
