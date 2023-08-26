import React, { useEffect, useState } from "react";
import AppHeader from "../Header";
import AppFooter from "../Footer";
import MobUserIcon from "../../assets/Images/MobUser";
import MobSearchIcon from "../../assets/Images/MobSearch";
import MobDispensaryIcon from "../../assets/Images/MobDispensary";
import MobHeartIcon from "../../assets/Images/MobHeart";
import MobHomeIcon from "../../assets/Images/MobHome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobSettingsIcon from "../../assets/Images/MobSettings";
import DashboardLogo from "../../assets/Images/DashboardLogo";
import CrossIcon from "../../assets/Images/Cross";
import User from "../../assets/Images/sidelink-user.svg";
import SideLinkSettings from "../../assets/Images/sideLinkSettings";
import MobMapIcon from "../../assets/Images/mobMap";
import Hooks from "../../hooks";
import Premiumicon from "../../assets/Images/PremiumIcon";

const AppLayout = (props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { children } = props;
  const Location = useLocation();
  const mobFooter = [""];

  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
  }, []);

  const sideLinks =
    currentuserData?.userType === "retailer"
      ? [
          {
            name: "Home",
            link: "/home/retailer-dashboard",
          },
        ]
      : [
          {
            name: "Home",
            link: "/home",
          },
          {
            name: "Seed / Bud Swap",
            link: "/home/seed",
          },
          // {
          //   name: "Seed Store",
          //   link: "/home/seed",
          // },

          // {
          //   name: "Dispensary",
          //   link: "/home/dispensaries",
          // },
          // {
          //   name: "Cannabis Lounge",
          //   link: "/home/cannabis",
          // },
          // {
          //   name: "Head Store",
          //   link: "/home/headshops",
          // },
          {
            name: "Favourites",
            link: "/favourite",
          },
        ];

  const head =
    currentuserData?.userType === "retailer"
      ? ["/home/retailer-dashboard"]
      : [
          "/home",
          "/home/map",
          "/aboutus",
          "/home/seed",
          "/home/buds",
          "/home/dispensaries",
          "/home/cannabis",
          "/home/headshops",
          "/home/seed/map",
          "/home/buds/map",
          "/home/dispensaries/map",
          "/home/cannabis/map",
          "/home/headshops/map",
        ];
  const { Logout } = Hooks();
  const [currentUserData, setcurrentUserData] = useState([]);
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentUserData(data);
  }, []);

  return (
    <div className="app-layout">
      {isOpen && (
        <div className={`app-menu d-flex d-xl-none`}>
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <span onClick={() => setIsOpen(!isOpen)} className="cr-p mb-4">
                <CrossIcon />
              </span>
            </div>
            <div className="d-flex align-items-center gap-2  mb-4 pb-3">
              <DashboardLogo />
              <div>
                <h3 className="font-18 font-weight-700">GROW AND SHARE</h3>
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
              <Link
                onClick={() => setIsOpen(!isOpen)}
                to={"/home/subscription"}
                className={`${
                  "/home/subscription" === Location.pathname
                    ? "side-link-active"
                    : ""
                }  side-link d-flex justify-content-start align-items-center gap-2`}
              >
                Premium
                <Premiumicon />
              </Link>
              <p
                className="side-link cr-p"
                onClick={() => navigate(`/chat/${currentuserData?._id}`)}
              >
                Chat
              </p>
              {/* {currentuserData?.userType === "consumer" && (
                <Link
                  to={"/favourite"}
                  className={`${
                    "/favourite" === Location.pathname
                      ? "product-item-active "
                      : ""
                  } dropdown-item`}
                >
                  <p
                className="side-link cr-p"
              >
                Favorite
              </p>
                </Link>
              )} */}
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
                    currentUserData.photo
                      ? `${process.env.REACT_APP_PORT}/${currentUserData.photo}`
                      : User
                  }
                  alt=""
                  className="side-link-user-img"
                />
                <div>
                  <h3 className="font-18 font-weight-700">
                    {currentUserData.fullName || currentUserData.storeName}
                  </h3>
                  <p className="font-10">{currentUserData.userType}</p>
                </div>
              </div>
            </div>
            <Link to="/myaccount" onClick={() => setIsOpen(!isOpen)}>
              <SideLinkSettings />
            </Link>
          </div>
        </div>
      )}

      <AppHeader setIsOpen={setIsOpen} isOpen={isOpen} />
      <div
        className={`content-footer ${
          head.includes(Location.pathname) ? "mob-app-content-footer" : ""
        } ${
          mobFooter.includes(Location.pathname) ? "small-header-mob-footer" : ""
        }`}
      >
        {children}
        <div className="d-sm-block d-none">
          <AppFooter />
        </div>
      </div>
      {head.includes(Location.pathname) ? (
        <div className="mobile-view-footer d-sm-none b-block">
          {!Location.pathname.includes("map") ? (
            <Link to={`${Location.pathname}/map`} className={`center-location`}>
              <MobMapIcon />
            </Link>
          ) : (
            <Link className={`center-location`}>
              <MobMapIcon />
            </Link>
          )}
          <div className="container mx-auto h-100">
            <div className="d-flex align-items-center justify-content-between gap-5 h-100 px-xs-4 mx-2">
              <div className="d-flex align-items-center justify-content-between h-100 section-1">
                <Link
                  to={"/home"}
                  className={`${
                    Location.pathname.includes("/home")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobHomeIcon />
                </Link>
                <Link
                  to={"/favourite"}
                  className={`${
                    Location.pathname.includes("/favourite")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobHeartIcon />
                </Link>
                <Link
                  to={"/search"}
                  className={`${
                    Location.pathname.includes("/search")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobSearchIcon />
                </Link>
              </div>
              <div className="d-flex align-items-center justify-content-between h-100 section-2">
                <Link
                  to={"/home/dispensaries"}
                  className={`${
                    Location.pathname.includes("/dispensaries")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobDispensaryIcon />
                </Link>
                <Link
                  // to={"/myaccount"}
                  className={`${
                    Location.pathname.includes("/myaccount")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobSettingsIcon />
                </Link>
                <Link
                  to={"/myaccount"}
                  className={`${
                    Location.pathname.includes("/myaccount")
                      ? "mob-footer-link-active"
                      : ""
                  } mob-footer-link`}
                >
                  <MobUserIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AppLayout;
