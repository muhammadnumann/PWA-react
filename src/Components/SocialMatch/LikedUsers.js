import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import userprofile from "../../assets/Images/social-user.svg";
import EmptyDataImage from "../../assets/Images/EmptyData";
import axios from "axios";

const LikedUsers = ({ currentIndex }) => {
  const [likedUsers, setlikedUsers] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URI}users/getProfileLikes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    })
      .then((response) => {
        setlikedUsers(response?.data?.records);
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  }, [currentIndex]);

  return (
    <>
      <div className={`row m-0 px-1 ${likedUsers.length > 0 ? "" : "h-100"}`}>
        {likedUsers.length > 0 ? (
          (likedUsers || []).map((data, index) => {
            return (
              <div className="col-6 px-2 mb-4" key={index}>
                <div className="social-card text-center">
                  <img
                    src={
                      data?.photo
                        ? `${process.env.REACT_APP_PORT}/${data.photo}`
                        : userprofile
                    }
                    alt=""
                    className="w-100 mb-3 social-dashboard-user-img"
                  />
                  <h3 className="font-16-social font-weight-700 text-dark-black mb-2 text-capitalize">
                    {data.fullName || data.storeName}
                  </h3>
                  <p className="font-12 font-weight-500 mt-1">
                    Cannabis Consumption (
                    {data.smoking ? data.smoking : "Not Defined"})
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex h-100 justify-content-center align-items-center w-100">
            <EmptyDataImage />
          </div>
        )}
      </div>
    </>
  );
};

export default LikedUsers;
