import React, { useState } from "react";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [forgotPassword, setforgotPassword] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const formHandler = (e) => {
    const { name, value } = e.target;
    setforgotPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const ForgotPassword = () => {
    Axios.post(
      `${process.env.REACT_APP_API_URI}users/forgotUserPass`,
      forgotPassword
    )
      .then((response) => {
        toast.success(response.data.message);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    ForgotPassword();
  };
  return (
    <>
      <div className="max-width-521 min-width-521">
        <h2 className="auth-model-heading mb-4">Forgot Password?</h2>
        <p className="auth-model-desc mb-5">Reset your password.</p>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Enter your Email to Verify
            </label>
            <input
              className="auth-input mb-3"
              type="email"
              placeholder="Email"
              name="email"
              required
              onChange={(e) => formHandler(e)}
              value={forgotPassword.email}
            />
          </div>
          <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-3">
          <button
            className="green-btn-outline custom-w min-width-208"
            onClick={() => goBack()}
          >
            Back
          </button>
          <button
            className="green-btn custom-w min-width-208">
            Recover
          </button>
        </div>


        </form>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
