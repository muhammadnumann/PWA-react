import React, { useEffect, useState } from "react";
import AddSocialUserIcon from "./AddSocialUser";
import SocialChatIcon from "./SocialChatIcon";
import Axios from "../../axios/Axios";
import userprofile from "../../assets/Images/social-user.svg";
import { CreateChat } from "../../Api";
import { useNavigate } from "react-router-dom";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { PaginationControl } from "react-bootstrap-pagination-control";

const SocialDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [currentuserData, setcurrentuserData] = useState();
  const [page, setPage] = useState(1);
  const [conversationType, setconversationType] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
  }, []);
  useEffect(() => {
    localStorage.setItem("platform", "social");
    const type = localStorage.getItem("platform");
    setconversationType(type);
  }, []);
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const currentUserPreference = localStorage.getItem("social-preferences");
    let preferenceData = JSON.parse(currentUserPreference);
    const getUsersUrl = `${process.env.REACT_APP_API_URI}users/getUserByfilter${
      preferenceData
        ? `?${
            preferenceData?.hasOwnProperty("looking") &&
            preferenceData.looking !== ""
              ? `&gender=${preferenceData?.looking}`
              : ""
          }${
            preferenceData?.hasOwnProperty("age") && preferenceData.age !== ""
              ? `&age=${preferenceData?.age}`
              : ""
          }${
            preferenceData?.hasOwnProperty("sort") && preferenceData.sort !== ""
              ? `&sort=${preferenceData?.sort}`
              : ""
          }${
            preferenceData?.hasOwnProperty("matchRole") &&
            preferenceData.matchRole !== ""
              ? `&userType=${data?.userType}`
              : ""
          }${
            preferenceData?.hasOwnProperty("photoOnly") &&
            preferenceData.photoOnly !== ""
              ? `&photoOnly=${true}`
              : ""
          }${
            preferenceData?.hasOwnProperty("datingLifestyle") &&
            preferenceData.datingLifestyle !== ""
              ? `&datingLifestyle=${preferenceData?.datingLifestyle}`
              : ""
          }${
            preferenceData?.hasOwnProperty("intimate") &&
            preferenceData.intimate !== ""
              ? `&lookingFor=${preferenceData?.intimate}`
              : ""
          }${
            preferenceData?.hasOwnProperty("socialSetting") &&
            preferenceData.socialSetting !== ""
              ? `&socialSetting=${preferenceData?.socialSetting}`
              : ""
          }${
            preferenceData?.hasOwnProperty("smoking") &&
            preferenceData.smoking !== ""
              ? `&smoking=${preferenceData?.smoking}`
              : ""
          }${
            preferenceData?.hasOwnProperty("radius") &&
            preferenceData.radius !== ""
              ? `&radius=${preferenceData?.radius}`
              : ""
          }`
        : ""
    }`;
    GetAllUsers(getUsersUrl);
  }, []);

  const GetAllUsers = async (getUsersUrl) => {
    try {
      const fetchData = await Axios.get(getUsersUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      setAllUsers(fetchData.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
      console.log(error);
    }
  };

  const pageHandler = (page) => {
    setPage(page);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const currentUserPreference = localStorage.getItem("social-preferences");
    let preferenceData = JSON.parse(currentUserPreference);
    const getUsersUrl = `${process.env.REACT_APP_API_URI}users/getUserByfilter${
      preferenceData
        ? `?${
            preferenceData?.hasOwnProperty("looking") &&
            preferenceData.looking !== ""
              ? `&gender=${preferenceData?.looking}`
              : ""
          }${
            preferenceData?.hasOwnProperty("age") && preferenceData.age !== ""
              ? `&age=${preferenceData?.age}`
              : ""
          }${
            preferenceData?.hasOwnProperty("sort") && preferenceData.sort !== ""
              ? `&sort=${preferenceData?.sort}`
              : ""
          }${
            preferenceData?.hasOwnProperty("matchRole") &&
            preferenceData.matchRole !== ""
              ? `&userType=${data?.userType}`
              : ""
          }${
            preferenceData?.hasOwnProperty("photoOnly") &&
            preferenceData.photoOnly !== ""
              ? `&photoOnly=${true}`
              : ""
          }${
            preferenceData?.hasOwnProperty("datingLifestyle") &&
            preferenceData.datingLifestyle !== ""
              ? `&datingLifestyle=${preferenceData?.datingLifestyle}`
              : ""
          }${
            preferenceData?.hasOwnProperty("intimate") &&
            preferenceData.intimate !== ""
              ? `&lookingFor=${preferenceData?.intimate}`
              : ""
          }${
            preferenceData?.hasOwnProperty("socialSetting") &&
            preferenceData.socialSetting !== ""
              ? `&socialSetting=${preferenceData?.socialSetting}`
              : ""
          }${
            preferenceData?.hasOwnProperty("smoking") &&
            preferenceData.smoking !== ""
              ? `&smoking=${preferenceData?.smoking}`
              : ""
          }${
            preferenceData?.hasOwnProperty("radius") &&
            preferenceData.radius !== ""
              ? `&radius=${preferenceData?.radius}`
              : ""
          }`
        : ""
    }`;
    GetAllUsers(getUsersUrl);
  };

  return (
    <div className="container h-100">
      <div className={`row m-0 px-1 ${allUsers.length > 0 ? "" : "h-100"}`}>
        {allUsers.length > 0 ? (
          (allUsers || []).users?.map((data, index) => {
            return (
              <div className="col-6 px-2 mb-4" key={index}>
                <div className="social-card text-center">
                  <img
                    onClick={() => navigate(`/social/profile/${data?._id}`)}
                    src={
                      data?.socialPhotos
                        ? `${process.env.REACT_APP_PORT}/${data.socialPhotos[0]}`
                        : userprofile
                    }
                    alt=""
                    className="w-100 mb-3 social-dashboard-user-img cr-p"
                  />
                  <h3 className="font-16-social font-weight-700 text-dark-black mb-2 text-capitalize">
                    {data.fullName || data.storeName}
                  </h3>
                  <p className="font-12 font-weight-500 mt-1 cut-text">
                    <span>{data?.age}</span>
                    <span>{data?.gender}</span>
                    <span>{data?.location?.address}</span>
                  </p>
                  <div className="d-flex justify-content-around align-items-center mt-2 pt-1">
                    <span
                      className="cr-p"
                      onClick={() =>
                        CreateChat(
                          currentuserData?._id,
                          data?._id,
                          navigate,
                          conversationType
                        )
                      }
                    >
                      <SocialChatIcon />
                    </span>
                    <span
                      className="cr-p"
                      data-bs-toggle="modal"
                      href="#exampleModalToggle"
                    >
                      <AddSocialUserIcon />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex justify-content-center align-items-center w-100">
            <EmptyDataImage />
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4">
        {allUsers.totalRecords > 10 && (
          <PaginationControl
            page={page}
            between={3}
            total={allUsers.totalRecords}
            limit={allUsers.limit}
            changePage={(page) => pageHandler(page)}
            ellipsis={1}
          />
        )}
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content mx-4">
            <div className="modal-body text-center">
              <h3 className="font-20-social font-weight-900 mb-4 text-dark-black">
                Enable Push Notification
              </h3>
              <p className="font-16-25 font-weight-500 text-dark-black">
                Looks like your push notifications are disabled! You might be
                missing out a lot! turn notifications back on?
              </p>
              <div className="d-flex gap-3 mt-4 pt-3">
                <button
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className="green-btn-outline text-primary-green"
                >
                  No Thanks
                </button>
                <button className="green-btn">Yes, Please</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;
