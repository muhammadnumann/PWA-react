import React from "react";
import seed1 from "../../assets/Images/seed1.svg";
import seed2 from "../../assets/Images/seed2.svg";
import seed3 from "../../assets/Images/seed3.svg";
import { Link } from "react-router-dom";
import DistanceIcon from "../../assets/Images/Distance";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import BudCount from "../../assets/Images/BudCount";
import { useState } from "react";
import { useEffect } from "react";
import { markersData } from "./fakeData";
import Axios from "../../axios/Axios";
import GoogleMapNew from "./GoogleMap/GoogleMapNew";

const seedsDetail = [
  {
    id: 1,
    name: "Raza Awan",
    active: false,
  },
  {
    id: 2,
    name: "Raza Awan",
    active: true,
  },
  {
    id: 3,
    name: "Raza Awan",
    active: false,
  },
];
const seedData = [
  {
    id: 1,
    name: "Toronto, Ontario",
    img: seed1,
    distance: "3 km Away",
    location: "Indica, White Rhino",
    count: "20 Seeds",
    rating: "5.0",
    totalReviews: "(56 Reviews)",
    active: false,
  },
  {
    id: 2,
    name: "Toronto, Ontario",
    img: seed2,
    distance: "3 km Away",
    location: "Indica, White Rhino",
    count: "20 Seeds",
    rating: "5.0",
    totalReviews: "(56 Reviews)",
    active: true,
  },
  {
    id: 3,
    name: "Toronto, Ontario",
    img: seed3,
    distance: "3 km Away",
    location: "Indica, White Rhino",
    count: "20 Seeds",
    rating: "5.0",
    totalReviews: "(56 Reviews)",
    active: false,
  },
];

const BudsMap = () => {
  const [crimes, setcrimes] = useState([]);

  const API_URI =
    "https://data.police.uk/api/crimes-street/all-crime?poly=52.268,0.543:52.794,0.238:52.130,0.478";
  const getAlerts = async () => {
    try {
      const fetchData = await Axios.get(API_URI);
      setcrimes(fetchData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAlerts();
  }, []);

  // console.log(markersData)
 
  return (
    <div>
      <div className="row flex-md-row flex-column-reverse seed-card p-0 flex-row ms-12 me-12">
        <div
          className="col-md-6 p-0 nav flex-column nav-pills map-card-col"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {seedData.map((data, index) => {
            return (
              <div
                key={index}
                className={`${data.active ? "active" : ""
                  } nav-link w-100 map-link bg-white rounded-0 w-100 justify-content-start h-auto`}
                id={`v-pills-${data.id}-tab`}
                data-toggle="pill"
                href={`#v-pills-${data.id}`}
                role="tab"
                aria-controls={`v-pills-${data.id}`}
                aria-selected="true"
              >
                <div className="flex-column">
                  <div className="position-relative text-black d-flex flex-lg-row flex-md-column justify-content-between gap-sm-4 ga-2">
                    <img
                      className="w-lg-40-100-40 intro-img h-100"
                      src={data.img}
                      alt=""
                    />
                    <div className="ps-sm-0 ps-3 w-100 d-flex flex-column justify-content-between">
                      <div>
                        <p className="mb-3 font-24 font-weight-700">
                          {data.name}
                        </p>
                        <div className="d-flex gap-2 align-items-sm-center flex-sm-row flex-column mb-sm-3 mb-2">
                          <span className="d-flex gap-2 align-items-center font-18  font-weight-500 ">
                            <svg
                              width={13}
                              height={18}
                              viewBox="0 0 13 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                opacity="0.4"
                                d="M6.50284 0C4.08381 0 2.11719 1.91701 2.11719 4.27503C2.11719 6.58804 3.97301 8.46005 6.39205 8.54105C6.46591 8.53205 6.53977 8.53205 6.59517 8.54105C6.61364 8.54105 6.62287 8.54105 6.64133 8.54105C6.65057 8.54105 6.65057 8.54105 6.6598 8.54105C9.02344 8.46005 10.8793 6.58804 10.8885 4.27503C10.8885 1.91701 8.92187 0 6.50284 0Z"
                                fill="#5D8B2F"
                              />
                              <path
                                d="M11.1903 10.9352C8.61435 9.26119 4.41335 9.26119 1.81889 10.9352C0.646307 11.7002 0 12.7352 0 13.8422C0 14.9492 0.646307 15.9752 1.80966 16.7312C3.10227 17.5772 4.80114 18.0002 6.5 18.0002C8.19886 18.0002 9.89773 17.5772 11.1903 16.7312C12.3537 15.9662 13 14.9402 13 13.8242C12.9908 12.7172 12.3537 11.6912 11.1903 10.9352Z"
                                fill="#5D8B2F"
                              />
                            </svg>
                            <span>Tony Stark</span>
                          </span>
                          <span className="d-flex gap-1 align-items-center font-18 font-weight-500">
                            <DistanceIcon />
                            {data.distance}
                          </span>
                          <span className="d-flex gap-1 align-items-center font-18 font-weight-500">
                            <BudCount />
                            {data.count}
                          </span>
                        </div>
                        <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                          <LocationIcon />
                          <span>789 Yonge St, Toronto, ON M4W 2G8, Canada</span>
                        </span>
                      </div>

                      <div className="d-xl-flex d-none flex-xl-row flex-column justify-content-between align-items-end gap-xl-3 gap-2 mt-3 ">
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-700">
                            <RatingIcon />
                            <span>5.0</span>
                          </span>
                          <span className="font-14-100 text-grey font-weight-400">
                            <span>(56 Reviews)</span>
                          </span>
                        </div>
                        <Link
                          to={"/home/bud/seedinfo"}
                          className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                        >
                          {" "}
                          <span>View Profile </span>{" "}
                          <span className="icon-green-bg bg-light-green">
                            <FavouriteIcon />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-xl-none d-flex flex-row justify-content-between align-items-end gap-xl-3 gap-2 mt-3 flex-wrap">
                    <div className="d-flex gap-2 align-items-center">
                      <span className="d-flex gap-2 align-items-center font-18 font-weight-700">
                        <RatingIcon />
                        <span className="text-black">5.0</span>
                      </span>
                      <span className="font-14-100 text-grey font-weight-400">
                        <span>(56 Reviews)</span>
                      </span>
                    </div>
                    <Link
                      to={"/favourite/userprofile"}
                      className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                    >
                      {" "}
                      <span>View Profile </span>{" "}
                      <span className="icon-green-bg bg-light-green">
                        <FavouriteIcon />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-md-6 p-0 mb-md-0 mb-4 p-3 ps-0">
          {seedsDetail.map((chatsdetail, index) => {
            return (
              <div
                key={index}
                className={`${chatsdetail.active ? "active show" : ""
                  } tab-pane h-100 w-100 fade  chat-detail`}
                id={`v-pills-${chatsdetail.id}`}
                role="tabpanel"
                aria-labelledby={`v-pills-${chatsdetail.id}-tab`}
              >
                <div
                  style={{ height: "100vh", width: "100%" }}
                  className="custom-map position-relative"
                >
                  <div className="d-flex justify-content-end w-100 poeple-sharing-seed">
                    <button className="green-btn-outline bg-white z-index-1 text-black d-flex align-items-center justify-content-between font-18 py-sm-3 gap-2 w-max-content">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M7.0254 0C4.41078 0 2.28516 2.13 2.28516 4.75C2.28516 7.32 4.29103 9.4 6.90564 9.49C6.98548 9.48 7.06531 9.48 7.12519 9.49C7.14515 9.49 7.15513 9.49 7.17509 9.49C7.18507 9.49 7.18507 9.49 7.19505 9.49C9.74979 9.4 11.7557 7.32 11.7656 4.75C11.7656 2.13 9.64001 0 7.0254 0Z"
                          fill="#5D8B2F"
                        />
                        <path
                          d="M12.0951 12.1499C9.31083 10.2899 4.77018 10.2899 1.96595 12.1499C0.698562 12.9999 0 14.1499 0 15.3799C0 16.6099 0.698562 17.7499 1.95597 18.5899C3.3531 19.5299 5.18932 19.9999 7.02553 19.9999C8.86175 19.9999 10.698 19.5299 12.0951 18.5899C13.3525 17.7399 14.0511 16.5999 14.0511 15.3599C14.0411 14.1299 13.3525 12.9899 12.0951 12.1499Z"
                          fill="#5D8B2F"
                        />
                        <path
                          opacity="0.4"
                          d="M17.9929 5.3401C18.1526 7.2801 16.7754 8.9801 14.8694 9.2101C14.8594 9.2101 14.8594 9.2101 14.8494 9.2101H14.8195C14.7596 9.2101 14.6997 9.2101 14.6498 9.2301C13.6818 9.2801 12.7936 8.9701 12.125 8.4001C13.1529 7.4801 13.7417 6.1001 13.6219 4.6001C13.5521 3.7901 13.2726 3.0501 12.8535 2.4201C13.2327 2.2301 13.6718 2.1101 14.1209 2.0701C16.0769 1.9001 17.8233 3.3601 17.9929 5.3401Z"
                          fill="#5D8B2F"
                        />
                        <path
                          d="M19.9894 14.5904C19.9096 15.5604 19.2909 16.4004 18.253 16.9704C17.2551 17.5204 15.9976 17.7804 14.7502 17.7504C15.4687 17.1004 15.8879 16.2904 15.9677 15.4304C16.0675 14.1904 15.4787 13.0004 14.3011 12.0504C13.6325 11.5204 12.8541 11.1004 12.0059 10.7904C14.2113 10.1504 16.9856 10.5804 18.6921 11.9604C19.6102 12.7004 20.0792 13.6304 19.9894 14.5904Z"
                          fill="#5D8B2F"
                        />
                      </svg>
                      {markersData.length} People Sharing Seeds
                    </button>
                  </div>
                  <GoogleMapNew markersData={crimes.data} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudsMap;
