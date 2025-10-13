import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();
  const userLogin = JSON.parse(localStorage.getItem("userLogin") || "null");

  useEffect(() => {
    if (!userLogin || userLogin.status === false) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng nhập tài khoản!",
        showConfirmButton: false,
        timer: 2000,
        html: "<div style='height:100px;'></div>",
      });
      navigate("/login");
    }
  }, [userLogin, navigate]);

  const handleLogout = () => {
    if (userLogin) {
      const updatedUser = { ...userLogin, status: false };
      localStorage.setItem("userLogin", JSON.stringify(updatedUser));
    }
    Swal.fire({
        icon: "success",
        title: "Đăng xuất tài khoản thành công!",
        showConfirmButton: false,
        timer: 2000,
        html: "<div style='height:100px;'></div>",
      });
    setTimeout(() => {
      navigate("/login");
    },1000)
  };
  const handleProject = () => {
    navigate("/projects");
  };
  const handleMyTask =() => {
    navigate("myTask");
  }

  return (
    <div>
      <header>
        <div className="header-container">
          <h2 className="h2Header">Quản Lý Dự Án</h2>
          <div className="link-container">
            <a className="a link" onClick={handleProject}>
              Dự Án
            </a>
            <a className="a link" onClick={handleMyTask} >
              Nhiệm Vụ Của Tôi
            </a>
            <a className="a link" onClick={handleLogout} id="out">
              Đăng Xuất
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
