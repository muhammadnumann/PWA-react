import React, { useState } from "react";
import UserStartIcon from "../../assets/Images/UserStart";
import SocialFilterIcon from "../../assets/Images/SocialFilter";
import { useLocation, useNavigate } from "react-router-dom";

const SocialFooter = () => {
  const [type, setType] = useState("sortbyvotes");
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div
      className={`${
        location.pathname.includes("/social/posts")
          ? "post-footer"
          : "social-footer"
      }   d-sm-none`}
    >
      {!location.pathname.includes("/social/posts") ? (
        <>
          <div
            onClick={() => navigate("/social/dashboard")}
            className="cr-p d-flex flex-column gap-2 align-items-center h-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width={27}
              height={29}
              viewBox="0 0 122.88 112.07"
              style={{ enableBackground: "new 0 0 122.88 112.07" }}
              xmlSpace="preserve"
            >
              <g>
                <path
                  fill="#99c76b"
                  stroke="#5D8B2F"
                  strokeWidth="8px"
                  // fill="#5D8B2F"
                  d="M61.44,0L0,60.18l14.99,7.87L61.04,19.7l46.85,48.36l14.99-7.87L61.44,0L61.44,0z M18.26,69.63L18.26,69.63 L61.5,26.38l43.11,43.25h0v0v42.43H73.12V82.09H49.49v29.97H18.26V69.63L18.26,69.63L18.26,69.63z"
                />
              </g>
            </svg>
            <p className="font-12 font-weight-700">Home</p>
          </div>
          <div
            onClick={() => navigate("/social/match")}
            className="cr-p d-flex flex-column gap-2 align-items-center h-100"
          >
            <UserStartIcon />
            <p className="font-12 font-weight-700">Swipe</p>
          </div>
          {!location.pathname.includes("social/match") && (
            <div
              onClick={() => navigate("/social/lookingfor")}
              className="cr-p d-flex flex-column gap-2 align-items-center h-100"
            >
              <SocialFilterIcon />
              <p className="font-12 font-weight-700">Filter</p>
            </div>
          )}
        </>
      ) : (
        <div
          className="btn-group btn-group-toggle h-100 rounded-0 w-100"
          data-toggle="buttons"
        >
          <label className="btn font-14 bg-grey active d-flex align-items-center rounded-0">
            <input
              type="radio"
              name="options"
              id="sortbyvotes"
              autoComplete="off"
              readOnly
              checked={type === "sortbyvotes"}
              onChange={handleChange}
              value="sortbyvotes"
            />
            <span className="">Sort by votes</span>
          </label>
          <label className="btn font-14 bg-grey d-flex align-items-center rounded-0">
            <input
              type="radio"
              name="options"
              id="newestfirst"
              value="newestfirst"
              autoComplete="off"
              checked={type === "newestfirst"}
              onChange={handleChange}
            />
            <span className="">Newest first</span>
          </label>
          <label className="btn font-14 bg-grey d-flex align-items-center rounded-0">
            <input
              type="radio"
              name="options"
              id="mymoments"
              value="mymoments"
              autoComplete="off"
              checked={type === "mymoments"}
              onChange={handleChange}
            />
            <span className="">My moments</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SocialFooter;
