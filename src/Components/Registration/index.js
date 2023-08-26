import React from "react";
import "../Components.css";
import LogoIcon from "../../assets/Images/Logo";
import ResponsiveLogo from "../../assets/Images/responsiveLogo";
import { useLocation } from "react-router-dom";
const RegistrationLayout = (props) => {
  const { children } = props;
  const location = useLocation();
  return (
    <div
      className={`${
        !location.pathname.includes("/social") ? "auth-model" : ""
      } `}
    >
      <div className="registration-layout d-flex flex-column justify-content-start align-items-center">
        <div className="d-sm-none d-flex justify-content-between align-items-center w-100 mobile-header">
          <div className="d-flex flex justify-content-center align-items-center gap-2">
            <ResponsiveLogo />
            <div>
              <h3 className="text-white font-18-100 mb-2">GROW AND SHARE</h3>
              <p className="text-white font-10">Cannabis Connections, Infinite Selections.</p>
            </div>
          </div>
        </div>
        <div
          className={`${
            location.pathname.includes("/social") ? "social-content" : "content"
          } `}
        >
          <div className="d-sm-flex d-none flex-column justify-content-center align-items-center mb-5 ">
            <LogoIcon />
            <h3 className="text-white pt-3 mt-1 mb-3">GROW AND SHARE</h3>
            <p className="text-white">Cannabis Connections, Infinite Selections.</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default RegistrationLayout;
