import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../interfaces/interface";
import { useDispatch, useSelector } from "react-redux";
import { addUser, featchUser } from "../../redux/slices/AuthorsSlice";
import type { AppDispatch, RootState } from "../../redux/stores";
import Swal from "sweetalert2";
export default function Register() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(featchUser());
  }, [dispatch]);
  const users = useSelector((state: RootState) => state.users.users);

  const handleLogin = () => {
    navigate("/login");
  };

  console.log(users);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newError = {
      fullname: "",
      email: "",
      password: "",
      confirm: "",
    };

    let hasError = false;

    if (!fullname.trim()) {
      newError.fullname = "Họ và tên không được để trống";
      hasError = true;
    }
    const foundUser = users.find((user) => user.email === email);

    if (foundUser) {
      newError.email = "Email đã được sử dụng";
      hasError = true;
    } else {
      if (!email.trim()) {
        newError.email = "Email không được để trống";
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newError.email = "Email không hợp lệ";
        hasError = true;
      }
    }

    if (!password) {
      newError.password = "Mật khẩu không được để trống";
      hasError = true;
    } else if (password.length < 8) {
      newError.password = "Mật khẩu phải từ 8 ký tự";
      hasError = true;
    }

    if (!confirm) {
      newError.confirm = "Xác nhận mật khẩu không được để trống";
      hasError = true;
    } else if (confirm !== password) {
      newError.confirm = "Mật khẩu xác nhận không khớp";
      hasError = true;
    }

    setError(newError);

    if (hasError) return;

    const newUser: User = {
      id: String(Date.now()),
      fullname,
      email,
      password,
    };

    dispatch(addUser(newUser));
    Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      showConfirmButton: false,
      timer: 2000,
      html: "<div style='height:100px;'></div>",
    });
    navigate("/login");
  };

  return (
    <div>
      <div className="container-register">
        <h1 className="header-form">Đăng kí</h1>
        <div className="form-container-register">
          <form onSubmit={handleSubmit} id="form">
            <div className="content">
              <TextField
                error={Boolean(error.fullname)}
                helperText={error.fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="input-register"
                label="Họ và tên"
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
            </div>
            <div className="content">
              <TextField
                error={Boolean(error.email)}
                helperText={error.email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-register"
                label="Địa chỉ email"
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
            </div>
            <div className="content">
              <TextField
                error={Boolean(error.password)}
                helperText={error.password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-register"
                label="Mật khẩu"
                type="password"
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
            </div>
            <div className="content">
              <TextField
                error={Boolean(error.confirm)}
                helperText={error.confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-register"
                label="Xác nhận mật khẩu"
                type="password"
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
            </div>
            <div className="content">
              <button type="submit" className="btnSubmit-signUp">
                Đăng kí
              </button>
            </div>
            <div className="footer-form">
              <p>Đã có tài khoản?</p>
              <a onClick={handleLogin} className="navigate">
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
