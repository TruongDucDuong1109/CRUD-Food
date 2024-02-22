import CustomInput from "../components/CustomInput";
import { Container } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/user/userSlice";

const signUpSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Signup = () => {
    const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  return (
    <>
      <Container className="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3"> Sign Up</h3>
              <form
                onSubmit={formik.handleSubmit}
                action=""
                className="d-flex flex-column gap-15"
              >
                <CustomInput
                  type="text"
                  label="First Name"
                  name="firstName"
                  val={formik.values.firstName}
                  OnCh={formik.handleChange("firstName")}
                />
                <div className="error">
                  {formik.touched.firstName &&
                  formik.errors.firstName ? (
                    <div>{formik.errors.firstName}</div>
                  ) : null}
                </div>
                <CustomInput
                  type="text"
                  label="Last Name"
                  name="lastName"
                  val={formik.values.lastName}
                  OnCh={formik.handleChange("lastName")}
                />
                <div className="error">
                  {formik.touched.lastName &&
                  formik.errors.lastName ? (
                    <div>{formik.errors.lastName}</div>
                  ) : null}
                </div>
                
                <CustomInput
                  type="email"
                  label="Email"
                  name="email"
                  val={formik.values.email}
                  OnCh={formik.handleChange("email")}
                />
                <div className="error">
                  {formik.touched.email &&
                  formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                  ) : null}
                </div>

                <CustomInput
                  type="password"
                  label="Password"
                  name="password"
                  val={formik.values.password}
                  OnCh={formik.handleChange("password")}
                />
                 <div className="error">
                  {formik.touched.password &&
                  formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Signup;
