import React, { useEffect, useState } from "react";
import SocialFooter from "../Social App/Footer";
import DashboardLogo from "../../assets/Images/DashboardLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuBarIcon from "../../assets/Images/MenuBar";
import Hooks from "../../hooks";
import User from "../../assets/Images/sidelink-user.svg";
import CrossIcon from "../../assets/Images/Cross";
import SideLinkSettings from "../../assets/Images/sideLinkSettings";

const SocialLayout = (props) => {
  const { children } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { Logout } = Hooks();
  const [currentUserData, setcurrentUserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentUserData(data);
  }, []);
  console.log(currentUserData);

  const sideLinks = [
    {
      name: "Dashboard",
      link: "/social/dashboard",
    },
    // {
    //   name: "Posts",
    //   link: "/social/posts",
    // },
    {
      name: "Chat",
      link: `/chat/${currentUserData?._id}`,
    },

    {
      name: "Match",
      link: "/social/match",
    },
  ];

  return (
    <div className="d-flex flex-column justify-content-between h-100 ">
      {isOpen && (
        <div className={`app-menu d-flex d-lg-none`}>
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <span onClick={() => setIsOpen(!isOpen)} className="cr-p mb-4">
                <CrossIcon />
              </span>
            </div>
            <div className="d-flex align-items-center gap-2  mb-4 pb-3">
              <DashboardLogo />
              <div>
                <h3 className="font-18 font-weight-700">Smokin’Singles</h3>
                <p className="font-10">
                  Cannabis Connections, Infinite Selections.
                </p>
              </div>
            </div>

            <div className="d-flex flex-column  side-links-main">
              {sideLinks.map((data, index) => {
                return (
                  <Link
                    onClick={() => setIsOpen(!isOpen)}
                    key={index}
                    to={data.link}
                    className={`${
                      data.link === Location.pathname ? "side-link-active" : ""
                    }  side-link`}
                  >
                    {data.icon} {data.name}
                  </Link>
                );
              })}
              <p
                className="side-link border-0 cr-p"
                onClick={() => Logout(navigate)}
              >
                Logout
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2 pt-4 section-2">
            <div className="dropdown">
              <div className="d-flex align-items-center gap-2" type="button">
                <img
                  src={
                    currentUserData.socialPhotos
                      ? `${process.env.REACT_APP_PORT}/${currentUserData.socialPhotos[0]}`
                      : User
                  }
                  alt=""
                  className="side-link-user-img"
                />
                <div>
                  <h3 className="font-18 font-weight-700">
                    {currentUserData.fullName}
                  </h3>
                  <p className="font-10">{currentUserData.userType}</p>
                </div>
              </div>
            </div>
            <Link to={"/social/setting"}>
              <SideLinkSettings />
            </Link>
          </div>
        </div>
      )}
      <div
        className={`w-100 app-header d-sm-none flex-column justify-content-center ${
          location.pathname.includes("/social/match") ? "tinder-header" : ""
        } `}
      >
        <div className="container gap-2 px-4 mx-auto d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <svg
              onClick={() => navigate(-1)}
              width={12}
              height={27}
              viewBox="0 0 12 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6137 26.0731C12.1288 25.504 12.1288 24.5812 11.6137 24.0121L3.0135 14.5098C2.51295 13.9568 2.51295 13.0432 3.0135 12.4902L11.6137 2.98793C12.1288 2.41879 12.1288 1.49601 11.6137 0.926861C11.0985 0.357712 10.2634 0.357712 9.74825 0.926861L1.14809 10.4291C-0.382695 12.1205 -0.382695 14.8795 1.14809 16.5709L9.74825 26.0731C10.2634 26.6423 11.0985 26.6423 11.6137 26.0731Z"
                fill="#6B6B6B"
              />
            </svg>
            <Link to="/home">
              <DashboardLogo />
            </Link>
            <div className="d-flex flex-column gap-1">
              <h3 className="app-heading">Smokin’Singles </h3>
              <p className="font-10 d-sm-none">
                Cannabis Connections,<br/> Infinite Selections.
              </p>
            </div>
          </div>

          <Link
            to={
              currentUserData?.userType === "retailer"
                ? "/home/retailer-dashboard"
                : "/home"
            }
            className={`d-sm-none app-heading  ${
              location.pathname.includes("/social/match")
                ? "text-dark"
                : "text-primary-green"
            }`}
          >
            Grow And Share
          </Link>

          <span
            onClick={() => setIsOpen(!isOpen)}
            className="cr-p d-lg-none d-block"
          >
            <MenuBarIcon />
          </span>
        </div>
      </div>
      <div
        className={
          location.pathname.includes("/social/match")
            ? "social-home-content p-0"
            : "social-home-content"
        }
      >
        {children}
      </div>
      <SocialFooter />
    </div>
  );
};

export default SocialLayout;
