import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import ShowPassword from "../../assets/Images/ShowPassword";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [forgotPassword, setforgotPassword] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    setforgotPassword((prevState) => ({
      ...prevState,
      email: email,
    }));
  }, [location.search]);

  const [passwordError, setPasswordError] = useState("");
  const [passwordShown1, setPasswordShown1] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [passwordCheck, setpasswordCheck] = useState(false);
  const navigate = useNavigate();

  const formHandler = (e) => {
    const { name, value } = e.target;
    setforgotPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (
      name === "password" &&
      (value.length < 8 || value.length > 12 || !/[!@#$%^&*]/.test(value))
    ) {
      setPasswordError(
        "Choose a password between 8-12 characters and include one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const ResetPassword = () => {
    console.log(forgotPassword);
    const data = {
      email: forgotPassword.email,
      password: forgotPassword.password,
    };
    Axios.patch(
      `${process.env.REACT_APP_API_URI}users/resetForgetPassword`,
      data
    )
      .then((response) => {
        toast.success(response?.data?.message);
        console.log(response?.data);
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
        console.log(error);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setpasswordCheck(true);

    if (passwordError) {
      return;
    }

    if (!/[!@#$%^&*]/.test(forgotPassword.password)) {
      setPasswordError("Password must include at least one special character.");
      return;
    }
    if (
      forgotPassword.password.length < 8 ||
      forgotPassword.password.length > 12
    ) {
      setPasswordError("Password must be between 8-12 characters.");
      return;
    }

    if (
      forgotPassword.password !== forgotPassword.passwordConfirm ||
      forgotPassword.password.length < 8 ||
      forgotPassword.password.length > 12
    ) {
      setPasswordError(
        "Choose a password between 8-12 characters and include one special character."
      );
    } else {
      console.log("called");
      setPasswordError("");
      ResetPassword();
    }
  };
  return (
    <>
      <div className="max-width-521 min-width-521">
        <h2 className="auth-model-heading mb-4">Reset Password.</h2>
        <p className="auth-model-desc mb-5">Reset your new password.</p>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="mb-3">
            <div className="auth-input d-flex align-items-center justify-content-between">
              <input
                name="password"
                required
                type={passwordShown1 ? "text" : "password"}
                defaultValue={forgotPassword.password}
                placeholder="Enter password"
                className="password-input w-75"
                onChange={(e) => formHandler(e)}
                minLength={8}
                maxLength={12}
              />
              <span
                onClick={() => {
                  setPasswordShown1(!passwordShown1);
                }}
                className="see-pswd-btn cr-p"
              >
                <ShowPassword />
              </span>
            </div>
          </div>
          {passwordError !== "" && (
            <p className="text-danger mt-1">{passwordError}</p>
          )}

          <div className="mb-3">
            <div className="auth-input d-flex align-items-center justify-content-between">
              <input
                name="passwordConfirm"
                required
                defaultValue={forgotPassword.passwordConfirm}
                type={passwordShown2 ? "text" : "password"}
                placeholder="Confirm password"
                className="password-input w-75"
                onChange={(e) => formHandler(e)}
                minLength={8}
                maxLength={12}
              />
              <span
                onClick={() => {
                  setPasswordShown2(!passwordShown2);
                }}
                className="see-pswd-btn cr-p"
              >
                <ShowPassword />
              </span>
            </div>
            {passwordCheck && (
              <div>
                {forgotPassword.password !== forgotPassword.passwordConfirm && (
                  <div className="d-flex justify-content-start align-items-center">
                    <p className="text-danger mt-1">
                      Password are not the same.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="green-btn" >Save</button>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordPage;
