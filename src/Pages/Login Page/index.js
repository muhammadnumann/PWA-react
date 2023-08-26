import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShowPassword from "../../assets/Images/ShowPassword";
import GoogleIcon from "../../assets/Images/Google";
import { LoginSocialGoogle } from "reactjs-social-login";
import { PostLoginData, googleLogin } from "../../Api";

const LoginPage = () => {
  const [loginDetails, setloginDetails] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("remember-user");
    const data = JSON.parse(user);
    setloginDetails({ email: data?.email });
  }, []);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [passwordShown, setPasswordShown] = useState(false);
  const [rememberCheck, setRememberCheck] = useState(false);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setloginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    PostLoginData(loginDetails, rememberCheck, navigate);
  };

  const terms = () => {
    navigate('/terms')
  }
  return (
    <>
      <div className="max-width-521 min-width-521">
        <h2 className="auth-model-heading mb-4">Welcome Back!</h2>
        <p className="auth-model-desc mb-5">Please login to your account.</p>
        <form onSubmit={(e) => submitHandler(e)}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => formHandler(e)}
            value={loginDetails.email}
          />

          <div className="auth-input my-3 d-flex align-items-center justify-content-between w-100">
            <input
              name="password"
              required
              type={passwordShown ? "text" : "password"}
              placeholder="Enter password"
              className="password-input w-75"
              onChange={(e) => formHandler(e)}
              value={loginDetails.password}
            />{" "}
            <span
              onClick={() => {
                setPasswordShown(!passwordShown);
              }}
              className="see-pswd-btn cr-p"
            >
              <ShowPassword />
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-4 pb-3">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="head-checkbox"
                onChange={() => setRememberCheck(!rememberCheck)}
              />
              <label htmlFor="head-checkbox">
                <span className="ps-2 font-16-100 font-weight-600">
                  Remember me
                </span>
              </label>
            </div>
            <Link
              to="/forgotpassword"
              className="text-white font-16-100 font-weight-600"
            >
              <u>Forget Password?</u>
            </Link>
          </div>
          <button className="green-btn">Login</button>
        </form>
        <div className="or font-18-100 font-weight-600"> or </div>

        <LoginSocialGoogle
          client_id={
            "643396070667-bfebpofn127mm7krc7c4iamdu5ejckig.apps.googleusercontent.com"
          }
          discoveryDocs="claims_supported"
          access_type="offline"
          onResolve={({ provider, data }) => {
            const apiData = {
              access_token: data.access_token,
              email: data.email,
            };
            googleLogin(apiData, navigate);
          }}
          onReject={(error) => {
            console.log(error);
          }}
        >
          <button className="google-login w-100 my-4">
            <GoogleIcon />
            <span className="ps-3 font-weight-700 font-18-100">
              Login with Google
            </span>
          </button>
        </LoginSocialGoogle>
        <Link
          className="text-white d-flex justify-content-center align-items-center gap-1 font-weight-500 font-18"
          to="/age"
        >
          Don’t have an account?
          <span className="text-primary-green font-weight-700">Register</span>
        </Link>
        <p className="text-center text-grey mt-5 pt-sm-0 pt-3 font-16" onClick={terms}>
          Terms of use | Privacy Policy 
        </p>
      </div>
    </>
  );
};

export default LoginPage;
