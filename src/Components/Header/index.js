import React, { useEffect, useState } from "react";
import DashboardLogo from "../../assets/Images/DashboardLogo";
import DispensaryIcon from "../../assets/Images/Dispensary";
import CannbisIcon from "../../assets/Images/Cannbis";
import HeadShopIcon from "../../assets/Images/HeadShop";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobSearchIcon from "../../assets/Images/MobSearch";
import MenuBarIcon from "../../assets/Images/MenuBar";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import Hooks from "../../hooks";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import ScopeIcon from "../../assets/Images/Scope";
import Premiumicon from "../../assets/Images/PremiumIcon";

const products = [
  {
    name: "Dispensary",
    icon: <DispensaryIcon />,
    link: "/home/dispensaries",
  },
  {
    name: "Cannabis Lounge",
    icon: <CannbisIcon />,
    link: "/home/cannabis",
  },
  {
    name: "Head Shop",
    icon: <HeadShopIcon />,
    link: "/home/headshops",
  },
];

const AppHeader = (props) => {
  const Location = useLocation();
  const { isOpen, setIsOpen } = props;
  const { Logout } = Hooks();

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
  }, []);

  const head =
    currentuserData?.userType === "retailer"
      ? ["/home/retailer-dashboard"]
      : [
          "/home",
          "/aboutus",
          "/home/seed",
          "/home/buds",
          "/home/dispensaries",
          "/home/growDepot",
          "/home/cannabis",
          "/home/headshops",
          "/home/seed/map",
          "/home/buds/map",
          "/home/dispensaries/map",
          "/home/cannabis/map",
          "/home/headshops/map",
        ];

  const headLinks =
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
          //   name: "Seeds",
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
          //   name: "Head Shop",
          //   link: "/home/headshops",
          // },
          // {
          //   name: "Grow Depot",
          //   link: "/home/growDepot",
          // },
        ];

  let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${currentuserData?._id}`;

  const GetUser = async () => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      navigate("/social/signup");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div
      className={`app-header ${
        head.includes(Location.pathname) ? "mob-app-header" : ""
      }`}
    >
      <div className="container gap-2 px-4 mx-auto d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <svg
            onClick={() => navigate(-1)}
            className={`${
              Location.pathname === "/home" ? "d-none" : ""
            } d-sm-none`}
            width={9}
            height={18}
            viewBox="0 0 9 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.71025 0.29552C9.09658 0.689547 9.09658 1.32839 8.71025 1.72242L2.26012 8.30089C1.88471 8.68377 1.88471 9.31623 2.26012 9.69911L8.71025 16.2776C9.09658 16.6716 9.09658 17.3105 8.71025 17.7045C8.32391 18.0985 7.69753 18.0985 7.31119 17.7045L0.861065 11.126C-0.287021 9.95507 -0.287021 8.04493 0.861066 6.874L7.31119 0.29552C7.69753 -0.0985068 8.32391 -0.0985067 8.71025 0.29552Z"
              fill="#0F8140"
            />
          </svg>

          <DashboardLogo />
          <div className="d-flex flex-column gap-1">
            <h3 className="app-heading">GROW AND SHARE </h3>
            <p className="font-10 d-sm-none">
              Cannabis Connections, Infinite Selections.
            </p>
          </div>
        </div>
        <Link
          onClick={() => GetUser()}
          className="d-sm-none d-flex gap-1 align-items-center text-primary-green font-weight-600"
        >
          <span className="w-max-content app-heading">Smokin’Singles</span>
        </Link>
        <div className="d-flex gap-xl-2 headlink d-xl-flex d-none h-100">
          <div className="d-flex gap-xl-2 headlink d-xl-flex d-none h-100">
            {headLinks.map((data, index) => {
              return (
                <Link
                  key={index}
                  to={data.link}
                  className={`${
                    data.link === Location.pathname ||
                    Location.pathname.includes(`${data.link}/map`)
                      ? "product-item-active  "
                      : ""
                  }  product-item `}
                >
                  {data.icon} {data.name}
                </Link>
              );
            })}
          </div>

          <div className="dropdown cr-p d-none d-xl-flex header-dropdown">
            <div
              className="d-flex align-items-center gap-2 drop-btn"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="icon-green-bg bg-light-green rounded-circle">
                <FavouriteIcon />
              </span>
            </div>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <Link
                to={"/home/subscription"}
                className={`${
                  "/home/subscription" === Location.pathname
                    ? "product-item-active "
                    : ""
                } dropdown-item d-flex justify-content-start align-items-center gap-2`}
              >
                Premium
                <Premiumicon />
              </Link>
              <p
                className="dropdown-item"
                onClick={() => navigate(`/chat/${currentuserData?._id}`)}
              >
                Chat
              </p>
              {currentuserData?.userType === "consumer" && (
                <Link
                  to={"/favourite"}
                  className={`${
                    "/favourite" === Location.pathname
                      ? "product-item-active "
                      : ""
                  } dropdown-item`}
                >
                  Favourites
                </Link>
              )}
              <Link
                to={"/myaccount"}
                className={`${
                  "/myaccount" === Location.pathname
                    ? "product-item-active "
                    : ""
                } dropdown-item`}
              >
                My Account
              </Link>

              <div
                onClick={() => Logout(navigate)}
                to={"/login"}
                className={` dropdown-item`}
              >
                Logout
              </div>
            </ul>
          </div>
        </div>
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="cr-p d-xl-none d-block"
        >
          <MenuBarIcon />
        </span>
      </div>

      {head.includes(Location.pathname) && (
        <div className="allproduct-mob d-none mt-5">
          <div className="container mx-auto">
            <div className="d-flex flex-sm-row flex-column-reverse align-items-sm-center justify-content-between gap-4">
              <div className="d-flex align-items-center gap-4 justify-content-between">
                <h2 className=" m ms-12 me-12">All Products</h2>

                {!Location.pathname.includes("map") ? (
                  <Link
                    to={`${Location.pathname}/map`}
                    className="text-white view-map-btn d-flex align-items-center gap-3 height-56 rounded-2"
                  >
                    View Map
                    <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-2">
                      <ScopeIcon />
                    </span>
                  </Link>
                ) : (
                  <Link className="text-white view-map-btn d-flex align-items-center gap-3 height-56 rounded-2">
                    View Map
                    <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-2">
                      <ScopeIcon />
                    </span>
                  </Link>
                )}
              </div>
              <div className="d-flex ps-12 pe-12 align-items-center gap-4">
                <div className="search-product  d-sm-none d-flex">
                  <input
                    placeholder="Search Product"
                    type="text"
                    className="border-0 outline-0 bg-transparent"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                  <span className="icon-green-bg">
                    <MobSearchIcon />
                  </span>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <button className="border-0 outline-0 bg-transparent p-0 height-56">
                    <svg
                      className=" h-100"
                      width={56}
                      height={56}
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width={55}
                        height={55}
                        rx="15.5"
                        fill="#5D8B2F"
                        fillOpacity="0.2"
                        stroke="#5D8B2F"
                      />
                      <path
                        d="M41.9999 15.2328V18.7889C41.9999 20.0821 41.186 21.6985 40.372 22.5067L33.3721 28.649C32.3954 29.4572 31.7442 31.0736 31.7442 32.3668V39.3173C31.7442 40.2872 31.0931 41.5803 30.2791 42.0652L28.0001 43.52C25.8838 44.8131 22.9536 43.3584 22.9536 40.7721V32.2051C22.9536 31.0736 22.3025 29.6189 21.6513 28.8107L20.0234 27.1134L29.4977 12H38.7442C40.5348 12 41.9999 13.4548 41.9999 15.2328Z"
                        fill="#5D8B2F"
                      />
                      <path
                        opacity="0.4"
                        d="M26.8603 12L18.4279 25.4324L15.4651 22.345C14.6512 21.5368 14 20.0821 14 19.1122V15.3945C14 13.4548 15.4651 12 17.2558 12H26.8603Z"
                        fill="#5D8B2F"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-sm-5 mt-4 mb-sm-5 pb-3 gap-4 d-flex align-items-start justify-content-between">
            <div className="d-flex gap-3 overflow-x-auto all-products-link px-4">
              {products.map((data, index) => {
                return (
                  <Link
                    key={index}
                    to={data.link}
                    className={`${
                      data.link === Location.pathname ||
                      Location.pathname.includes(`${data.link}/map`)
                        ? "product-item-active"
                        : ""
                    }  product-item`}
                  >
                    {data.icon} {data.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
