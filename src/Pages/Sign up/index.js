import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ShowPassword from "../../assets/Images/ShowPassword";
import { PostSignUp } from "../../Api";
import { useEffect } from "react";
import UploadIcon from "../../assets/Images/Upload";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [signInDetails, setsignInDetails] = useState({
    fullName: JSON.parse(localStorage.getItem("signupData"))?.fullName || "",
    userName: JSON.parse(localStorage.getItem("signupData"))?.userName || "",
    storeName: JSON.parse(localStorage.getItem("signupData"))?.storeName || "",
    startTime: JSON.parse(localStorage.getItem("signupData"))?.startTime || "",
    closeTime: JSON.parse(localStorage.getItem("signupData"))?.closeTime || "",
    email:
      state?.googleEmail ||
      JSON.parse(localStorage.getItem("signupData"))?.email ||
      "",
    password: JSON.parse(localStorage.getItem("signupData"))?.password || "",
    passwordConfirm:
      JSON.parse(localStorage.getItem("signupData"))?.passwordConfirm || "",
    userType:
      JSON.parse(localStorage.getItem("signupData"))?.userType || "retailer",
    age: JSON.parse(localStorage.getItem("signupData"))?.age || "",
    province: JSON.parse(localStorage.getItem("signupData"))?.province || "",
    logo: "",
    url: JSON.parse(localStorage.getItem("signupData"))?.url || "",
  });
  useEffect(() => {
    const user = sessionStorage.getItem("remember-age");
    setsignInDetails((prevState) => ({
      ...prevState,
      province: JSON.parse(user)?.province,
      age: JSON.parse(user)?.age,
    }));
    return () =>
      setsignInDetails((prevState) => ({
        ...prevState,
        province: JSON.parse(user)?.province,
        age: JSON.parse(user)?.age,
      }));
  }, []);

  const [passwordError, setPasswordError] = useState("");
  const [passwordShown1, setPasswordShown1] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [termCheck, setTermCheck] = useState(false);
  const [passwordCheck, setpasswordCheck] = useState(false);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setsignInDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (
      name === "password" &&
      (value.length < 8 || value.length > 12 || !/[!@#$%^&*]/.test(value))
    ) {
      setPasswordError(
        "Choose a password between 8-12 characters and include one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (signInDetails.userType === "retailer" && !signInDetails.logo) {
      return toast.error("Logo is required");
    }

    if (passwordError) {
      return;
    }
    if (!/[!@#$%^&*]/.test(signInDetails.password)) {
      setPasswordError("Password must include at least one special character.");
      return;
    }
    if (
      signInDetails.password.length < 8 ||
      signInDetails.password.length > 12
    ) {
      setPasswordError("Password must be between 8-12 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signInDetails.fullName);
    formData.append("userName", signInDetails.userName);
    formData.append("storeName", signInDetails.storeName);
    formData.append("startTime", signInDetails.startTime);
    formData.append("closeTime", signInDetails.closeTime);
    formData.append("email", signInDetails.email);
    formData.append("password", signInDetails.password);
    formData.append("passwordConfirm", signInDetails.passwordConfirm);
    formData.append("userType", signInDetails.userType);
    formData.append("age", signInDetails.age);
    formData.append("province", signInDetails.province);
    formData.append("logo", signInDetails.logo);
    formData.append("url", signInDetails.url);

    setpasswordCheck(true);
    if (signInDetails.password === signInDetails.passwordConfirm) {
      PostSignUp(signInDetails, formData, navigate, state?.googleEmail);
    } else {
      setPasswordError("Passwords do not match.");
      return;
    }
  };

  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setsignInDetails((prevState) => ({
        ...prevState,
        logo: e.target.files[0],
      }));
      setFile(imageFile?.name);
    }
  };

  
  const terms = () => {
    const dataSignup =
      localStorage.getItem("signupData") &&
      JSON.parse(localStorage.getItem("signupData"));
    const finalData = {
      ...dataSignup,
      ...signInDetails,
    };
    localStorage.setItem("signupData", JSON.stringify(finalData));
    navigate("/terms");
  };

  return (
    <>
      <div className="max-width-521">
        <h2 className="auth-model-heading mb-5">Create Account</h2>
        <form onSubmit={(e) => submitHandler(e)}>
          <select
            required
            className="auth-input mb-3"
            name="userType"
            onChange={(e) => formHandler(e)}
            defaultValue={signInDetails.userType}
          >
            <option value="">- Select Type -</option>
            <option value="retailer">Retailer</option>
            <option value="consumer">Consumer</option>
          </select>
          {signInDetails.userType === "consumer" ? (
            <React.Fragment>
              <input
                onChange={(e) => formHandler(e)}
                name="fullName"
                value={signInDetails.fullName}
                className="auth-input mb-3"
                type="text"
                placeholder="Full Name"
                required
              />
              <input
                onChange={(e) => formHandler(e)}
                name="userName"
                value={signInDetails.userName}
                className="auth-input mb-3"
                type="text"
                placeholder="User Name"
                required
              />
              {console.log(signInDetails)}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input
                onChange={(e) => formHandler(e)}
                name="storeName"
                className="auth-input mb-3"
                value={signInDetails.storeName}
                type="text"
                placeholder="Store Name"
                required
              />
              <input
                onChange={(e) => formHandler(e)}
                name="startTime"
                className="auth-input mb-3"
                type="text"
                value={signInDetails.startTime}
                placeholder="Open Time"
                onFocus={(e) => (e.target.type = "time")}
                required
              />
              <input
                onChange={(e) => formHandler(e)}
                name="closeTime"
                className="auth-input mb-3"
                type="text"
                value={signInDetails.closeTime}
                placeholder="Close Time"
                onFocus={(e) => (e.target.type = "time")}
                required
              />
              <input
                onChange={(e) => formHandler(e)}
                name="url"
                className="auth-input mb-3"
                type="text"
                value={signInDetails.url}
                placeholder="Website URL"
                required
              />
              <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
                <label className="text-white mb-2 font-weight-600 font-18-100">
                  Upload Logo
                </label>
                <label className="upload-file cr-p w-100 ">
                  <input
                    type="file"
                    className="d-none"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => attachFile(e)}
                  />
                  <div className="d-flex justify-content-center align-items-center h-100 w-100 gap-2">
                    <UploadIcon />
                    <p className="font-16 font-weight-500">
                      {file === null ? "Choose File / Drag & Drop Here" : file}
                    </p>
                  </div>
                </label>
              </div>
            </React.Fragment>
          )}
          <input
            className="auth-input mb-3"
            type="email"
            placeholder="Email"
            required
            name="email"
            value={signInDetails.email}
            readOnly={state?.googleEmail}
            onChange={(e) => formHandler(e)}
          />
          {!state?.googleEmail && (
            <div className="mb-3">
              <div className="auth-input d-flex align-items-center justify-content-between">
                <input
                  name="password"
                  required
                  type={passwordShown1 ? "text" : "password"}
                  value={signInDetails.password}
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
              {passwordError && (
                <div className="d-flex justify-content-start align-items-center">
                  <p className="text-danger mt-1">{passwordError}</p>{" "}
                </div>
              )}
            </div>
          )}

          {!state?.googleEmail && (
            <div className="mb-3">
              <div className="auth-input d-flex align-items-center justify-content-between">
                <input
                  name="passwordConfirm"
                  required
                  value={signInDetails.passwordConfirm}
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
                  {signInDetails.password !== signInDetails.passwordConfirm && (
                    <div className="d-flex justify-content-start align-items-center">
                      <p className="text-danger mt-1">
                        Passwords do not match.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="d-flex align-items-start flex-column">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="head-checkbox"
                onChange={() => setTermCheck(!termCheck)}
              />
              <label htmlFor="head-checkbox">
                <span className="ps-2 font-16-100 text-grey font-weight-500">
                  I confirm I have read and agree to the
                  <span
                    className="text-primary-green font-weight-700 px-1"
                    onClick={terms}
                  >
                    Term of use
                  </span>
                  and{" "}
                  <span
                    className="text-primary-green ps-md-4 font-weight-700"
                    onClick={terms}
                  >
                    Privacy policy
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-between mb-4 pb-2 mt-4 pt-3 btn-revese">
            <button
              className="green-btn-outline back-btn"
              onClick={() => goBack()}
              type="button"
            >
              Back
            </button>

            <button
              className="green-btn next-btn"
              disabled={termCheck ? passwordError !== "" : true}
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
        <Link
          className="text-white d-flex justify-content-center align-items-center gap-1 font-weight-500 font-18"
          to="/"
        >
          Already have an account?
          <span className="text-primary-green font-weight-700">Login</span>
        </Link>
        <p className="text-center text-grey mt-5 pt-sm-0 pt-3 font-16">
          Terms of use | Privacy Policy
        </p>
      </div>
    </>
  );
};

export default SignUpPage;
