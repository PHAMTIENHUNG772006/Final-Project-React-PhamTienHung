import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/stores";
import { featchUser } from "../../redux/slices/AuthorsSlice";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(featchUser());
  }, [dispatch]);
  const users = useSelector((state: RootState) => state.users.users);

  const handleRegister = () => {
    navigate("/register");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newError = { email: "", password: "" };
    let hasError = false;

    // Validate email
    if (!email.trim()) {
      newError.email = "Email không được để trống";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newError.email = "Email không hợp lệ";
      hasError = true;
    }

    // Validate password
    if (!password.trim()) {
      newError.password = "Mật khẩu không được để trống";
      hasError = true;
    } else if (password.length < 6) {
      newError.password = "Mật khẩu phải từ 6 ký tự";
      hasError = true;
    }

    setError(newError);

    // Nếu có lỗi thì dừng luôn
    if (hasError) return;

    // Tìm user trong danh sách
    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
      Swal.fire({
        icon: "error",
        title: "Email không tồn tại!",
      });
      return;
    }

    if (foundUser.password !== password) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không đúng!",
      });
      return;
    }

    // Nếu đúng thì login
    const userLogin = {
      id: foundUser.id,
      fullname: foundUser.fullname,
      status: true,
    };
    localStorage.setItem("userLogin", JSON.stringify(userLogin));

    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công!",
      showConfirmButton: false,
      timer: 1400,
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
      },
    });

    setTimeout(() => {
      navigate("/projects");
    }, 1500);
  };

  return (
    <div className="container-login">
      <h2 className="header-form">Đăng nhập</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit} action="" id="form">
          <div className="content">
            <label htmlFor="">Email</label>
            <TextField
              error={Boolean(error.email)}
              helperText={error.email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="outlined-basic"
              className="input "
              label="Nhập email"
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  height: "70px",
                  borderRadius: "9px"
                },
                "& .MuiInputBase-input": {
                  padding: "20px",
                  height: "40px",
                   textAlign: "center",
                },
              }}
            />
            <span className="error"></span>
          </div>
          <div className="content">
            <label htmlFor="">Password</label>
            <TextField
              error={Boolean(error.password)}
              helperText={error.password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="outlined-basic"
              className="input "
              label="Nhập password"
              variant="outlined"
              type="password"
               sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  height: "70px",
                   borderRadius: "9px"
                },
                "& .MuiInputBase-input": {
                  padding: "20px",
                  height: "40px",
                  textAlign: "center",
                },
              }}
            />
            <span className="error"></span>
          </div>
          <div className="content">
            <button id="btnSubmit-signIn">Đăng nhập</button>
          </div>
          <div className="footer-form">
            <p>Chưa có tài khoản?</p>
            <a onClick={handleRegister} className="navigate">
              Đăng kí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
