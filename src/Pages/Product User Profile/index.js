import React from "react";
import productuser from "../../assets/Images/productuser-1.svg";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import DispensryProductIcon from "../../assets/Images/Dispensry1";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SeedICon from "../../assets/Images/Seed";
import DispensaryIcon from "../../assets/Images/Dispensary";
import CannbisIcon from "../../assets/Images/Cannbis";
import HeadShopIcon from "../../assets/Images/HeadShop";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import Rating from "react-rating";
import ratingEmpty from "../../assets/Images/ratingEmpty.svg";
import ratingFull from "../../assets/Images/ratingFull.svg";
import { PostReview } from "../../Api";
import DistanceIcon from "../../assets/Images/Distance";
import CountIcon from "../../assets/Images/Count";
import PriceIcon from "../../assets/Images/Price";
import ImageDummy from "../../assets/Images/match/dummy.png";
import TimerIcon from "../../assets/Images/Timer";
import EmptyDataImage from "../../assets/Images/EmptyData";

const filter = [
  {
    id: 1,
    query: "",
    ariaSelected: false,
    name: "All",
  },
  {
    id: 2,
    query: "seedStore",
    ariaSelected: false,
    name: "Seed",
    icon: <SeedICon />,
  },
  {
    id: 3,
    query: "dispensary",
    ariaSelected: false,
    name: "Dispensary",
    icon: <DispensaryIcon />,
  },
  {
    id: 4,
    query: "cannabisLounge",
    ariaSelected: false,
    name: "Cannabis Lounge",
    icon: <CannbisIcon />,
  },
  {
    id: 5,
    query: "headShop",
    ariaSelected: false,
    name: "HeadShop",
    icon: <HeadShopIcon />,
  },
];

const ProductUserProfile = (props) => {
  const routeParams = useParams();
  const GetUserUrl = `${process.env.REACT_APP_API_URI}users/${routeParams.id}`;
  const [userData, setUserData] = useState([]);
  const [sharedByUser, setSharedByUser] = useState([]);
  const [category, setCategory] = useState("");
  const [ratingData, setRatingData] = useState({
    ProductUserId: "",
    LoginUserId: "",
    rating: 0,
  });
  const ratingHandler = (rating) => {
    setRatingData((prevState) => ({
      ...prevState,
      rating: rating,
    }));
    PostReview(ratingData);
    GetUser(GetUserUrl);
  };

  const GetSharedByUser = async (GetSharedByUserUrl) => {
    try {
      const fetchData = await Axios.get(GetSharedByUserUrl);
      console.log(fetchData.data);
      setSharedByUser(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const GetUser = async (GetOthersUrl) => {
    try {
      const fetchData = await Axios.get(GetOthersUrl);
      setUserData(fetchData.data.data.doc);
      console.log(fetchData.data.data.doc);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetSharedByUserUrl = `${process.env.REACT_APP_API_URI}users/getAllData/?userType=${data?.userType}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}&category=${category}&userId=${routeParams.id}`;
    GetSharedByUser(GetSharedByUserUrl);
    GetUser(GetUserUrl);
    setRatingData((prevState) => ({
      ...prevState,
      ProductUserId: routeParams.id,
      LoginUserId: data._id,
    }));
  }, [category, GetUserUrl, routeParams.id]);
  console.log(userData);

  return (
    <div className="product-user-profile">
      <div className="container mx-auto">
        <div className="row m-0">
          <div className="col-xl-3 pe-md-0 col-md-6 mb-md-0 pb-lg-0 mb-4 pb-3">
            <div className="seed-card flex-column">
              <div className="d-flex flex-lg-column justify-content-lg-center gap-4 justify-content-start align-items-lg-center mb-lg-5 mb-3">
                <img
                  src={
                    userData?.photo
                      ? `${process.env.REACT_APP_PORT}/${userData?.photo}`
                      : productuser
                  }
                  alt=""
                  className="mb-md-4 user-profile-image"
                />
                <div className="d-flex flex-column gap-3 align-items-lg-center">
                  <p className="font-24 font-weight-600">{userData.fullName}</p>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                      <RatingIcon />
                      <span>{userData.ratingsAverage}</span>
                    </span>
                    <span className="font-18-100 text-grey font-weight-400">
                      <span>({userData.ratingsQuantity} Reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                  <DispensryProductIcon />
                  <span>{userData.userType}</span>
                </span>
                <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M9.01101 0C9.67221 0.38157 10.2144 0.898813 10.5894 1.50576C10.9645 2.11271 11.1607 2.79056 11.1607 3.47907C11.1607 4.16759 10.9645 4.84544 10.5894 5.45238C10.2144 6.05933 9.67221 6.57657 9.01101 6.95814C8.34982 6.57657 7.80761 6.05933 7.43259 5.45238C7.05756 4.84544 6.86133 4.16759 6.86133 3.47907C6.86133 2.79056 7.05756 2.11271 7.43259 1.50576C7.80761 0.898813 8.34982 0.38157 9.01101 0Z"
                      fill="#5D8B2F"
                    />
                    <path
                      d="M2.40141 7.85023C3.84226 8.58371 5.55755 8.56388 6.95266 7.96917C6.90895 7.28092 6.66606 6.61328 6.24639 6.02779C5.82671 5.4423 5.24376 4.9578 4.55125 4.61895C3.86129 4.27905 3.08591 4.09052 2.29266 4.06979C1.4994 4.04906 0.712332 4.19675 0 4.50001C0.114353 5.84803 0.960565 7.13657 2.40141 7.85023Z"
                      fill="#5D8B2F"
                    />
                    <path
                      opacity="0.4"
                      d="M4.57273 13.3808C6.01358 12.6473 6.88266 11.3786 6.97414 10.0306C6.26499 9.7177 5.47636 9.56458 4.68096 9.58536C3.88557 9.60615 3.10901 9.80018 2.4229 10.1496C0.982049 10.883 0.112967 12.1518 0.0214844 13.4998C1.41659 14.0945 3.10901 14.1143 4.57273 13.3808Z"
                      fill="#5D8B2F"
                    />
                    <path
                      d="M11.1611 14.5307C11.1598 13.8437 10.9628 13.1677 10.5878 12.5626C10.2128 11.9574 9.67127 11.4418 9.01128 11.0615C8.35029 11.4409 7.808 11.9563 7.43284 12.5617C7.05768 13.167 6.86133 13.8435 6.86133 14.5307C6.86133 15.2179 7.05768 15.8943 7.43284 16.4997C7.808 17.105 8.35029 17.6204 9.01128 17.9998C9.67286 17.621 10.2156 17.1057 10.5908 16.5002C10.966 15.8947 11.162 15.218 11.1611 14.5307Z"
                      fill="#5D8B2F"
                    />
                    <path
                      opacity="0.4"
                      d="M15.5981 10.1495C14.1573 9.41607 12.442 9.43589 11.0469 10.0306C11.0906 10.7189 11.3335 11.3865 11.7531 11.972C12.1728 12.5575 12.7558 13.042 13.4483 13.3808C14.8891 14.1143 16.6044 14.0945 17.9995 13.4998C17.9558 12.8115 17.7129 12.1439 17.2933 11.5584C16.8736 10.9729 16.2906 10.4884 15.5981 10.1495Z"
                      fill="#5D8B2F"
                    />
                    <path
                      d="M13.4483 4.61879C12.7641 4.96604 12.1878 5.45261 11.7694 6.03636C11.3509 6.62012 11.1029 7.28347 11.0469 7.969C11.756 8.28191 12.5447 8.43504 13.3401 8.41425C14.1354 8.39346 14.912 8.19944 15.5981 7.85006C17.039 7.11658 17.9081 5.84786 17.9995 4.49984C16.6044 3.90513 14.912 3.88531 13.4483 4.61879Z"
                      fill="#5D8B2F"
                    />
                  </svg>
                  <span>{sharedByUser.length} Strains</span>
                </span>
              </div>

              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-4">
                <LocationIcon />
                <span>{userData.location?.address}</span>
              </span>
              <h3 className="fw-bolder fs-5 mb-3 d-flex align-items-center gap-2">
                Rate User
              </h3>
              <div className="d-flex align-items-center gap-2">
                <Rating
                  start={0}
                  stop={5}
                  step={1}
                  direction="ltr"
                  readonly={false}
                  initialRating={ratingData.rating}
                  emptySymbol={
                    <img src={ratingEmpty} alt="" className="me-2" />
                  }
                  fullSymbol={<img src={ratingFull} alt="" className="me-2" />}
                  onChange={ratingHandler}
                />
                <p className="fw-bold fs-6 m-0">{ratingData.rating}.0</p>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-md-6 ">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <h3 className="d-flex gap-2 align-items-center flex-wrap font-32 font-weight-600 ms-12 bordered-heading">
                Shared Strains
              </h3>
            </div>
            <ul
              className=" nav nav-pills ps-12 pe-12  gap-3 align-items-end m-0  flex-nowrap w-md-75 overflow-auto accessories mt-4"
              id="pills-tab"
              role="tablist"
            >
              {filter.map((data, index) => {
                return (
                  <li className="nav-item" key={index} role="presentation">
                    <button
                      className="nav-link product-item w-max-content"
                      id={`pills-${data.query}-tab`}
                      data-bs-toggle={`pill`}
                      data-bs-target={`#pills-${data.query}`}
                      type={`button`}
                      role={`tab`}
                      aria-controls={`pills-${data.query}`}
                      aria-selected={data.ariaSelected}
                      onClick={() => setCategory(data.query)}
                    >
                      {data.icon} {data.name}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="seeds-card-main row m-0 pt-5">
              {sharedByUser?.result?.length !== 0 ? (
                (sharedByUser || []).result?.map((data, index) => {
                  const imageUrl = data.photo
                    ? `${process.env.REACT_APP_PORT}/${data.photo[0]}`
                    : "http://localhost:4000/undefined";
                  const isPlaceholderImage =
                    imageUrl === "http://localhost:4000/undefined";
                  return (
                    <div
                      className="col-xl-4 col-md-12  mb-4 seed-card-col h-100"
                      key={index}
                    >
                      <div className="seed-card h-100 position-relative">
                        <div className="row m-0 flex-sm-column w-100">
                          <div className="col-4 col-sm-12 p-0">
                            {isPlaceholderImage ? (
                              <img
                                className="w-100 intro-img cards-image-style"
                                src={ImageDummy}
                                alt=""
                              />
                            ) : (
                              <img
                                className="w-100 intro-img cards-image-style"
                                src={imageUrl}
                                alt=""
                              />
                            )}
                          </div>
                          <div className="col-8 col-sm-12 p-0">
                            <div className="ps-sm-0 ps-3">
                              <p className="my-sm-4 mb-3 font-24 font-weight-700">
                                {data.strainName || data.brandName}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                  <DistanceIcon />
                                  <span className="cut-text">
                                    {data.distance} Away
                                  </span>
                                </span>
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                  {data.quantity ? (
                                    <CountIcon />
                                  ) : (
                                    <>
                                      {data.cost ? (
                                        <PriceIcon />
                                      ) : (
                                        <PriceIcon />
                                      )}
                                    </>
                                  )}

                                  <span className="cut-text">
                                    {data.quantity ? (
                                      `Seeds: ${data.quantity}`
                                    ) : (
                                      <>
                                        {data.cost
                                          ? `Fees: $${data.cost}`
                                          : `Entry Fee: $${data.entryFee}`}
                                      </>
                                    )}
                                  </span>
                                </span>
                              </div>
                              {data.timing && (
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500  mb-sm-3 mb-2">
                                  <TimerIcon />
                                  {data.timing}
                                </span>
                              )}
                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                <LocationIcon />
                                <span className="cut-text">
                                  {data.userId?.location?.address}
                                </span>
                              </span>
                              <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                  <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                    <RatingIcon />
                                    {data.userId.ratingsAverage}
                                  </span>
                                  <span className="font-14-100 text-grey font-weight-400">
                                    ({data.userId.ratingsQuantity} Reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="d-flex justify-content-center w-100">
                  <EmptyDataImage />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUserProfile;
