import { useSelector } from "react-redux";
import type { RootState } from "../redux/stores";
import { useParams } from "react-router-dom";
import type Project from "../interfaces/interface";
import type { ProjectMember } from "../interfaces/interface";
import { useEffect, useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";
interface EmpProps {
  open: boolean;
  onCancel: () => void;
  onDelete: (project: Project, employee: ProjectMember) => void;
  onUpdate: (project: Project, employee: ProjectMember) => void;
  onReload: () => void;
}

export default function ModalListEmp({
  open,
  onCancel,
  onDelete,
  onReload,
  onUpdate
}: EmpProps) {
  const users = useSelector((state: RootState) => state.users.users);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { id } = useParams<{ id: string }>();

  const foundProject = projects.find((p) => p.id === id);

  const members = foundProject?.members;

  const [tempMembers, setTempMembers] = useState<ProjectMember[]>(
    members || []
  );

  if (!members) return;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (open) {
      setTempMembers(members);
    }
  }, [open, members]);

  if (!open) {
    return;
  }

  const removedMembers = members.filter(
    (oldMem) => !tempMembers.some((newMem) => newMem.userId === oldMem.userId)
  );

  const handleRemoveTemp = (member: ProjectMember) => {
    if(member.role === "Project Owner") {
      Swal.fire({
            icon: "error",
            title: " Không thể xóa Project Owner",
            showConfirmButton: false,
            timer: 1000,
          });
        return;
    }

    setTempMembers((prev) => prev.filter((m) => m.userId !== member.userId));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    removedMembers.forEach((mem) => {
      onDelete(foundProject, mem);
    });
    onReload();
  };

  const handleUpdateRole = (
    e: ChangeEvent<HTMLInputElement>,
    member: ProjectMember
  ) => {
    const newRole = e.target.value;

    if(newRole === "Project Owner"){
       Swal.fire({
            icon: "warning",
            title: " Dự án đã có Project Owner",
            showConfirmButton: false,
            timer: 1000,
          });
        return;
    }
    setTempMembers((prev) =>
      prev.map((m) =>
        m.userId === member.userId ? { ...m, role: newRole } : m
      )
    )

     if (foundProject) {
      onUpdate(foundProject, { ...member, role: newRole });
    }
  };

  return (
    <div className="overlay">
      <div className="modalRenderEployee" id="modalRenderEployee">
        <div>
          <div className="modalrender">
            <div className="render-container">
              <form onSubmit={handleSubmit} action="">
                <div className="header-modal">
                  <div>
                    <p className="headerrender">Thành viên</p>
                  </div>
                  <div>
                    <button
                      className="close-btn close"
                      onClick={() => {
                        onCancel();
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <hr className="hr"></hr>
                <div className="flex">
                  <h2 className="contentHeader">Thành viên</h2>
                  <h2 className="contentHeader">Vai trò</h2>
                </div>
                <div id="bodyModalEmployee">
                  {tempMembers.map((member) => {
                    const user = users.find((u) => u.id === member.userId);
                    if (!user) return null;

                    return (
                      <div
                        key={member.userId}
                        className="employee-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="listEmployeeLeft"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <img
                              className="logoName"
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.fullname
                              )}&background=0D8ABC&color=fff&size=128&bold=true`}
                              alt="avatar"
                            />
                          </div>
                          <div>
                            <p className="nameMembers">{user.fullname}</p>
                            <p className="emailMembers">{user.email}</p>
                          </div>
                        </div>

                        <div className="listEmployeeRight">
                          <input
                            onChange={(e) => {
                              handleUpdateRole(e, member);
                            }}
                            type="text"
                            value={member.role}
                          />
                          <img
                            onClick={() => handleRemoveTemp(member)}
                            className="icon"
                            src="../../src/assets/icons/Trash.png"
                            alt=""
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr className="hr"></hr>
                <br />
                <div id="footer-modalrenderEmployee">
                  <button
                    className="btnCloseModalEmploye"
                    id="btnCloseModalEmployee"
                    onClick={() => {
                      onCancel();
                    }}
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    id="btnSaveModalEmploye"
                    className="btnSaveModalEmploye"
                  >
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
