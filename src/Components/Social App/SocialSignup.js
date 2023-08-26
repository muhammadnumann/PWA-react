import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocialPostSignUp } from "../../Api";
import ShowPassword from "../../assets/Images/ShowPassword";

const SocialSignUp = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [signUpDetails, setsignUpDetails] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    if (data?.isSocial) {
      navigate("/social/dashboard");
    } else setcurrentuserData(data);
    // let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    // GetUser(GetUserUrl);
    setsignUpDetails({
      email: data?.email,
      fullName: data?.fullName || data?.storeName,
      password: data?.password,
    });
  }, []);

  // const GetUser = async (GetUserUrl) => {
  //   try {
  //     const fetchData = await Axios.get(GetUserUrl);
  //     localStorage.setItem(
  //       "userdata",
  //       JSON.stringify(fetchData?.data?.data?.doc)
  //     );
  //     setcurrentuserData(fetchData?.data?.data?.doc);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //     console.log(error);
  //   }
  // };
  console.log(signUpDetails);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setsignUpDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    SocialPostSignUp(signUpDetails, navigate);
    // if (currentuserData) {
    //   SocialPostSignUp(signUpDetails, navigate);
    //   // navigate("/social/summary");
    // } else SocialPostSignUp(signUpDetails, navigate);
  };
  return (
    <div className=" mx-4 my-5 ">
      <div className="max-width-521 min-width-521 px-3 py-4">
        <p className="font-18 text-white text-center mb-4">
          To Provide you with the best matches based on your preferences and
          location while prioritizing your safety, we use your selected filters
          and approximate city location to connect you with like-minded
          individuals who share your interests and values. Rest assured that our
          dating and sharing features do not use your exact location.
        </p>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              What’s your email?
            </label>
            <input
              readOnly={currentuserData ? true : false}
              className="auth-input"
              type="email"
              placeholder="Email"
              required
              value={signUpDetails.email}
              name="email"
              onChange={(e) => formHandler(e)}
            />
          </div>

          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Choose a username
            </label>
            <input
              readOnly={currentuserData ? true : false}
              className="auth-input"
              type="text"
              placeholder="Username"
              required
              name="fullName"
              value={signUpDetails.fullName}
              onChange={(e) => formHandler(e)}
            />
          </div>

          {!currentuserData?.fullName && !currentuserData?.email && (
            <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
              <label className="text-white mb-2 font-weight-600 font-18-100">
                Enter your password
              </label>
              <div className="auth-input d-flex align-items-center justify-content-between">
                <input
                  name="password"
                  required
                  defaultValue={signUpDetails.passwordConfirm}
                  type={passwordShown ? "text" : "password"}
                  placeholder="Confirm password"
                  className="password-input w-75"
                  onChange={(e) => formHandler(e)}
                  minLength={8}
                  maxLength={12}
                />
                <span
                  onClick={() => {
                    setPasswordShown(!passwordShown);
                  }}
                  className="see-pswd-btn cr-p"
                >
                  <ShowPassword />
                </span>
              </div>
            </div>
          )}

          <button className="green-btn">Next</button>
        </form>
      </div>
    </div>
  );
};

export default SocialSignUp;
