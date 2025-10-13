import React, { useState } from "react";
import type { ProjectMember } from "../interfaces/interface";
import type Project from "../interfaces/interface";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/stores";
import { useParams } from "react-router-dom";

interface ModalAddEmployeeProps {
  open: boolean;
  onOk: (project: Project, employee: ProjectMember) => void;
  onCancel: () => void;
}

export default function ModalAddEmployee({
  open,
  onOk,
  onCancel,
}: ModalAddEmployeeProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState({
    email: "",
    role: "",
  });

  const { id } = useParams<{ id: string }>();
  const {users} = useSelector((state: RootState) => state.users);
  const projects = useSelector((state: RootState) => state.projects.projects);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newError = { email: "", role: "" };
    let hasError = false;

    const foundUser = users.find(
      (user) => user.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    const foundProject = projects.find((p) => p.id === id);
    if(!foundUser) return;

    if (!email.trim()) {
      newError.email = "Email không được để trống";
      hasError = true;
    }  else if (
      foundProject?.members.some((member) => member.userId === foundUser.id)
    ) {
      newError.email = "Nhân viên này đã có trong dự án";
      hasError = true;
    }

    if (email.length < 5) {
      newError.email = "Email không hợp lệ";
      hasError = true;
    } 


    if (!role) {
      newError.role = "Vui lòng nhập chức vụ";
      hasError = true;
    }

    if (role.length < 5 ) {
      newError.role = "Vui lòng nhập chức vụ chi tiết ";
      hasError = true;
    }

     if (role === "Project Owner") {
      newError.role = "Không được nhập Project Owner";
      hasError = true;
    }

    setError(newError);


    if (hasError || !foundProject || !foundUser) return;

 
    const newMember = { userId: foundUser.id, role };
    onOk(foundProject, newMember);


    setEmail("");
    setRole("");
    setError({ email: "", role: "" });
  };

  if (!open) return null;

  return (
    <div className="overlay">
      <div id="modalAddEmployee">
        <div className="modalAdd">
          <div className="add-container">
            <div className="header-modal">
              <p className="headerAdd">Thêm nhân viên</p>
              <button onClick={onCancel} className="close-btn">
                ×
              </button>
            </div>

            <hr className="hr" />

            <div className="body-modalAddEmp">
              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailEmployee"
                  type="text"
                  placeholder="Nhập email nhân viên..."
                />
                <span className="error">{error.email}</span>

                <label>Vai trò</label>
                <input 
                 value={role}
                  onChange={(e) => setRole(e.target.value)}
                  id="selectRole"
                  className="selectRole"
                type="text" />
                <span className="error">{error.role}</span>

                <hr className="hr" />

                <div className="footer-modalAddEmp">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btnCancel"
                  >
                    Huỷ
                  </button>
                  <button type="submit" className="btn btnSave">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
