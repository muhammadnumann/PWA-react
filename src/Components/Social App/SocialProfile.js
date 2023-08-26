import React from "react";
import { useNavigate } from "react-router-dom";
import userprofile from "../../assets/Images/social-user.svg";
import { useEffect } from "react";
import { useState } from "react";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";

const SocialProfile = () => {
  const navigate = useNavigate();
  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
  }, []);

  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentuserData(fetchData?.data?.data?.doc);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/social/lookingfor");
  };
  return (
    <div className=" pb-4 px-0">
      <div className="self-summary text-white m-4 mb-5 p-3 d-flex flex-column align-items-center gap-4 position-relative">
        {/* <img
          src={authSettings}
          alt=""
          className="settings-authprofile cr-p"
          onClick={() => navigate("/social/setting")}
        /> */}
        <img
          src={
            currentuserData?.socialPhotos
              ? `${process.env.REACT_APP_PORT}/${currentuserData.socialPhotos[0]}`
              : userprofile
          }
          alt=""
          className=" w-50 rounded-3 user-profile-image"
        />
        <h2 className="auth-model-heading px-4 text-left ">
          {currentuserData?.fullName}
        </h2>
        <div className="d-flex gap-4">
          <span>Age: {currentuserData?.age}</span>
          <span className="text-capitalize">
            Smoker: {currentuserData?.smoking}
          </span>
        </div>
        {/* <p className="font-14 font-weight-500 cut-text text-center">
          {currentuserData?.location.address}
        </p> */}
      </div>
      <div className="self-summary rounded-0 py-3 px-4">
        <p className="font-18-100 font-weight-700 pb-2 text-white">
          My Self- summary
        </p>
        <p className="font-14 font-weight-400 text-grey pt-1">
          {currentuserData?.selfSummary}
        </p>
      </div>
      <form onSubmit={(e) => submitHandler(e)} className="px-4 mt-4 pt-3">
        {/* <label className="text-white mb-2 font-weight-600 font-18-100">
          My Bio
        </label>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <textarea
            readOnly={currentuserData?.bio ? true : false}
            value={currentuserData?.bio}
            required
            className="auth-input-textarea border-grey rounded-3 h-auto"
            placeholder="Tell me about yourself!"
            name="bio"
          />
        </div>
        <input
          className="auth-input mb-4 text-capitalize"
          readOnly
          type="text"
          required
          placeholder="I’ve been kinky for"
          value={currentuserData?.gender}
        />
        <input
          className="auth-input mb-4"
          type="text"
          required
          placeholder="Height"
          readOnly
          value={currentuserData?.height}
        /> */}
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
          <button
            onClick={() => navigate("/social/lookingfor")}
            className="green-btn-outline text-primary-green custom-w min-width-208"
          >
            Settings
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
          <button
            onClick={() => navigate("/social/uploadpicture")}
            className="green-btn-outline text-primary-green custom-w min-width-208"
          >
            Add Media
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
          <button
            onClick={() => navigate("/social/setting")}
            className="green-btn-outline text-primary-green custom-w min-width-208"
          >
            Edit Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialProfile;
