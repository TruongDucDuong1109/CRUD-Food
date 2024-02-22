import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let schema = Yup.object().shape({
    email: Yup.string()
      .email("Cần có Email")
      .required("Email là bắt buộc"),
    password: Yup.string().required("Password là bắt buộc"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(loginUser(values));

    },
  });
  const { user, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.auth);
  useEffect(() => {
    console.log("Login useEffect called");
    if (user || isSuccess) {
      navigate("/");
    } else {
      navigate("");;
    }
  }, [user, isSuccess, navigate,isLoading,isError]);

  return (
    <div
      className="py-5"
      style={{ backgroundColor: "#ffd333", minHeight: "100vh" }}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-3">
        <h3 className="text-center">Đăng Nhập</h3>
        
        <p className="text-center">Vui lòng đăng nhập để tiếp tục</p>
        <div className="error text-center">
          {message.message === "Rejected" ? "You are not admin" : ""}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            val={formik.values.email}
            OnCh={formik.handleChange("email")}
            name="email"
            label="Địa chỉ Email"
            id="email"
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <CustomInput
            type="password"
            val={formik.values.password}
            OnCh={formik.handleChange("password")}
            name="password"
            label="Mật khẩu"
            id="password"
          />
          <div className="error">
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="mb-3 text-end">
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5"
            style={{ backgroundColor: "#ffd333" }}
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
