import React from "react";
import SeedICon from "../../assets/Images/Seed";
import CannbisIcon from "../../assets/Images/Cannbis";
import HeadShopIcon from "../../assets/Images/HeadShop";
import DispensaryIcon from "../../assets/Images/Dispensary";
import DistanceIcon from "../../assets/Images/Distance";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import StrainAvailableIcon from "../../assets/Images/StrainAvailable";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import { Link } from "react-router-dom";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import CountIcon from "../../assets/Images/Count";
import PriceIcon from "../../assets/Images/Price";
import EmptyDataImage from "../../assets/Images/EmptyData";

const filter = [
  {
    id: 1,
    query: "",
    ariaSelected: false,
    name: "All",
    icon: "",
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
const FavoriteProduct = (props) => {
  const [userInfo, setUserInfo] = useState({
    userId: "",
    category: "",
  });
  const [favouriteData, setFavouriteData] = useState([]);
  const [currentuserData, setcurrentuserData] = useState();

  const GetMarkFavourite = async (GetFavouriteUrl) => {
    try {
      const fetchData = await Axios.get(GetFavouriteUrl);
      setFavouriteData(fetchData.data);
      console.log(fetchData.data);
    } catch (error) {
      toast.error(error?.response.data.message);
      console.log(error);
    }
  };

  const favouriteHandler = (userId, prodId, categry) => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const markdata = {
      userId: userId,
      pId: prodId,
      category: categry,
      latlang: `${data.location.coordinates[0]},${data.location.coordinates[1]}`,
    };
    Axios.post(`${process.env.REACT_APP_API_URI}users/markFavourite`, markdata)
      .then((response) => {
        console.log(response.data);
        const currentUser = localStorage.getItem("userdata");
        let data = JSON.parse(currentUser);
        const GetFavouriteUrl = `${process.env.REACT_APP_API_URI}users/getFavorate/?userId=${data._id}&category=${userInfo.category}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
        GetMarkFavourite(GetFavouriteUrl);
        toast.success(response.data.messgae);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    const GetFavouriteUrl = `${process.env.REACT_APP_API_URI}users/getFavorate/?userId=${data._id}&category=${userInfo.category}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    GetMarkFavourite(GetFavouriteUrl);
  }, [userInfo]);

  return (
    <div className="all-product-section">
      <div className="container mx-auto">
        <div className="d-sm-flex d-none align-items-center gap-2 font-18-100 font-weight-500 mb-4 pe-12 ps-12">
          <Link to={"/home"} className="text-primary-green cr-p">
            Home
          </Link>
          &gt;
          <span
            onClick={() =>
              setUserInfo((prevState) => ({
                ...prevState,
                category: "",
              }))
            }
            className="text-primary-green cr-p"
          >
            Favourite
          </span>
        </div>
        <h3 className="font-32 font-weight-700 ms-12 allproduct-heading mb-4">
          Favourites
        </h3>
        <ul
          className=" nav nav-pills ps-12 pe-12  gap-3 align-items-end m-0 h-100 flex-nowrap w-md-75 overflow-auto accessories mb-5"
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
                  onClick={() =>
                    setUserInfo((prevState) => ({
                      ...prevState,
                      category: data.query,
                    }))
                  }
                >
                  {data.icon} {data.name}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="seeds-card-main row m-0">
          {favouriteData?.findProduct?.length !== 0 ? (
            (favouriteData || []).findProduct?.map((data, index) => {
              return (
                <div
                  className="col-md-6 col-xl-4 mb-4 seed-card-col"
                  key={index}
                >
                  <div className="seed-card flex-column">
                    <div className="row m-0 flex-sm-column w-100">
                      <div className="col-4 col-sm-12 p-0">
                        <img
                          className="intro-img cards-image-style"
                          src={`${process.env.REACT_APP_PORT}/${
                            Array.isArray(data.photo)
                              ? data.photo[0]
                              : data.photo
                          }`}
                          alt=""
                        />
                        <span
                          style={{ cursor: "pointer" }}
                          className="favourite-post"
                          onClick={() =>
                            favouriteHandler(
                              currentuserData?._id,
                              data._id,
                              data.category
                            )
                          }
                        >
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.372 11.3455C6.168 11.4183 5.832 11.4183 5.628 11.3455C3.888 10.7448 0 8.23897 0 3.99178C0 2.11695 1.494 0.600098 3.336 0.600098C4.428 0.600098 5.394 1.13403 6 1.9592C6.606 1.13403 7.578 0.600098 8.664 0.600098C10.506 0.600098 12 2.11695 12 3.99178C12 8.23897 8.112 10.7448 6.372 11.3455Z"
                              fill="#BE3F3F"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="col-8 col-sm-12 p-0">
                        <div className="ps-sm-0 ps-3">
                          <p className="mb-sm-4 mb-3 font-24 font-weight-700">
                            {data.name}
                          </p>
                          {/* <div className="d-flex gap-sm-5 gap-2 align-items-sm-center flex-sm-row flex-column mb-sm-3 mb-2"> */}

                          <div className="row m-0 mb-sm-3 mb-2">
                            <div className="col-sm-6 p-0">
                              <span className="d-flex gap-2 align-items-center font-18 mb-sm-3 mb-2 font-weight-500 ">
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
                                <h4 className="cut-text">
                                  {data.strainName ||
                                    data.productName ||
                                    data.brandName ||
                                    data.accessories ||
                                    data.name}
                                </h4>
                              </span>
                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                                {data.quantity ? (
                                  <CountIcon />
                                ) : (
                                  <>
                                    {data.cost ? <PriceIcon /> : <PriceIcon />}
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
                            <div className="col-sm-6 p-0">
                              <div className="d-flex gap-2 align-items-center flex-wrap mb-sm-3 mb-2">
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-700">
                                  <RatingIcon />
                                  <span>{data.userId.ratingsAverage}</span>
                                </span>
                                <span className="font-14-100 text-grey font-weight-400">
                                  <span>
                                    ({data.userId.ratingsQuantity} Reviews)
                                  </span>
                                </span>
                              </div>
                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                                <DistanceIcon />
                                <span className="cut-text">
                                  {data.distance === "out of range"
                                    ? data.distance
                                    : data.distance + "  Away"}
                                </span>
                              </span>
                            </div>
                          </div>
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-3">
                            <LocationIcon />
                            <span className="cut-text">
                              {data.userId.location.address}
                            </span>
                          </span>
                        </div>

                        <div className="d-sm-flex d-none flex-sm-row flex-column justify-content-between align-items-center gap-sm-3 gap-2 mt-3">
                          <button className="green-btn-outline text-primary-green ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2">
                            <span>Strains Available</span>
                            <span className="icon-green-bg">
                              <StrainAvailableIcon />
                            </span>
                          </button>
                          <Link
                            to={`/home/${data.category}/${data._id}`}
                            className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2"
                          >
                            <span>View Profile </span>
                            <span className="icon-green-bg bg-light-green">
                              <FavouriteIcon />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="d-sm-none d-flex flex-row justify-content-between align-items-center gap-sm-3 gap-2 mt-3">
                      <button className="green-btn-outline text-primary-green ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2">
                        <span>Strains Available</span>
                        <span className="icon-green-bg">
                          <StrainAvailableIcon />
                        </span>
                      </button>
                      <Link
                        to={"/favourite/userprofile"}
                        className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2"
                      >
                        <span>View Profile </span>
                        <span className="icon-green-bg bg-light-green">
                          <FavouriteIcon />
                        </span>
                      </Link>
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
  );
};

export default FavoriteProduct;
