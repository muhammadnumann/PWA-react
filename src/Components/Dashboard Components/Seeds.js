import React, { useRef } from "react";
import DistanceIcon from "../../assets/Images/Distance";
import CountIcon from "../../assets/Images/Count";
import RatingIcon from "../../assets/Images/Rating";
import LocationIcon from "../../assets/Images/Location";
import HeartIcon from "../../assets/Images/Heart";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import Axios from "../../axios/Axios";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { PaginationControl } from "react-bootstrap-pagination-control";
import ImageDummy from "../../assets/Images/match/dummy.png";
import SearchButtonIcon from "../../assets/Images/Search";
import ScopeIcon from "../../assets/Images/Scope";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import MobSearchIcon from "../../assets/Images/MobSearch";
import MultiRangeSlider from "multi-range-slider-react";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";

const libraries = ["places"];
const Seeds = () => {
  const params = useParams();
  const [seeds, setSeeds] = useState([]);
  const routeParams = useParams();
  const [currentuserData, setcurrentuserData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("Grams");
  const Location = useLocation();
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const GetSeeds = async (GetSeedsUrl) => {
    try {
      const fetchData = await Axios.get(GetSeedsUrl);
      console.log(fetchData.data);
      setSeeds(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const debouncedSearchedTerm = useDebounce(searchTerm);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetSeedsUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&userType=consumer&page=${page}&`
        : `getAllData/?page=${page}&`
    }userType=consumer&name=${searchTerm}&latlang=${
      data?.location?.coordinates[0]
    },${data?.location?.coordinates[1]}`;
    GetSeeds(GetSeedsUrl);
  }, [debouncedSearchedTerm]);

  const [page, setPage] = useState(1);

  const pageHandler = (page) => {
    setPage(page);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetSeedsUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&userType=consumer&page=${page}&`
        : `getAllData/?page=${page}&`
    }userType=consumer&latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }`;
    GetSeeds(GetSeedsUrl);
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetSeedsUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&userType=consumer&page=1&`
        : `getAllData/?page=1&`
    }latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }`;
    GetSeeds(GetSeedsUrl);
  }, []);

  const [filter, setFilter] = useState({
    radius: 0,
    area: "",
    quantity: "",
  });
  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const inputRef1 = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef1.current.getPlaces();
    if (place) {
      setFilter((prevState) => ({
        ...prevState,
        area: place.formatted_address,
      }));
    }
  };

  const GetAllProduct = async (GetAllProductUrl) => {
    try {
      const fetchData = await Axios.get(GetAllProductUrl);
      // console.log(fetchData.data);
      setSeeds(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const submitHandler = (event) => {
    event.preventDefault();
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    // console.log(filter.area);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/getDataByRadius?page=${page}&userType=consumer${`&radius=${filter.radius}`}${
      filter.quantity ? `&quantity=${filter.quantity}` : ""
    }${
      filter.area
        ? `&address=${filter.area}`
        : `&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`
    }`;
    GetAllProduct(GetAllProductUrl);
  };

  // const favouriteHandler = (userId, prodId, categry) => {
  //   const currentUser = localStorage.getItem("userdata");
  //   let data = JSON.parse(currentUser);
  //   const markdata = {
  //     userId: userId,
  //     pId: prodId,
  //     category: categry,
  //     latlang: `${data.location.coordinates[0]},${data.location.coordinates[1]}`,
  //   };
  //   axios
  //     .post(`${process.env.REACT_APP_API_URI}users/markFavourite`, markdata)
  //     .then((response) => {
  //       setSeeds((prevState) => ({
  //         ...prevState,
  //         result: prevState.result.map((product) => {
  //           if (product?._id === response?.data?.findproduct?._id) {
  //             return response?.data?.findproduct;
  //           } else {
  //             return product;
  //           }
  //         }),
  //       }));
  //       toast.success(response.data.messgae);
  //     })
  //     .catch((error) => {
  //       toast.error(error?.response?.data?.message);
  //       console.log(error);
  //     });
  // };

  const clearFilterHandler = (e) => {
    e.preventDefault();
    setFilter({
      radius: 0,
      area: "",
      quantity: "",
    });
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetSeedsUrl = `${process.env.REACT_APP_API_URI}users/getAllData/?page=${page}&userType=consumer&name=${searchTerm}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    GetSeeds(GetSeedsUrl);
  };
  const [minMax, setMinMax] = useState({
    minValue: 0,
    maxValue: 250,
  });
  const handleInput = (e) => {
    setMinMax({
      minValue: e.minValue,
      maxValue: e.maxValue,
    });
    setFilter((prevState) => ({
      ...prevState,
      radius: `${e.minValue}-${e.maxValue}`,
    }));
  };
  console.log(filter);

  return (
    <>
      <div className="allproduct-mob d-block">
        <div className="d-flex align-items-center justify-content-between gap-4 ps-12 pe-12">
          <h2 className="allproduct-heading ms-12 me-12">All Seed / Bud</h2>
          <button
            className="border-0 outline-0 bg-transparent p-0 d-sm-none"
            data-bs-toggle="modal"
            data-bs-target="#deactivatemodal"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="7.5"
                fill="#5D8B2F"
                fillOpacity="0.2"
                stroke="#5D8B2F"
              />
              <path
                d="M30.0002 10.8804V13.4205C30.0002 14.3442 29.4188 15.4988 28.8374 16.0761L23.8375 20.4634C23.1398 21.0407 22.6747 22.1953 22.6747 23.119V28.0837C22.6747 28.7764 22.2096 29.7001 21.6282 30.0465L20.0003 31.0856C18.4887 32.0092 16.3957 30.9701 16.3957 29.1228V23.0035C16.3957 22.1953 15.9306 21.1562 15.4655 20.5789L14.3027 19.3666L21.07 8.57129H27.6746C28.9537 8.57129 30.0002 9.61041 30.0002 10.8804Z"
                fill="#5D8B2F"
              />
              <path
                opacity="0.4"
                d="M19.1859 8.57129L13.1628 18.1658L11.0465 15.9606C10.4651 15.3833 10 14.3442 10 13.6514V10.9959C10 9.61041 11.0465 8.57129 12.3256 8.57129H19.1859Z"
                fill="#5D8B2F"
              />
            </svg>
          </button>
        </div>
        <div className="mt-sm-5 mt-4 mb-5 pb-3 gap-4 d-flex align-items-start justify-content-between ps-12 pe-12">
          <div className="search-product d-sm-flex d-none">
            <input
              placeholder="Search Product"
              className="border-0 outline-0 bg-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <div className="icon-green-bg">
              <SearchButtonIcon />
            </div>
          </div>
          <div className="d-flex w-100 justify-content-end align-items-center gap-4">
            <div className="search-product d-sm-none d-flex">
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
              {!Location.pathname.includes("map") ? (
                <Link
                  to={`${Location.pathname}/map`}
                  className="text-white view-map-btn p-2 d-sm-flex d-none align-items-center gap-3"
                >
                  <span className="d-md-block d-none ps-2">View Map</span>
                  <span className="view-map-btn-scope d-flex align-items-center justify-content-center ">
                    <ScopeIcon />
                  </span>
                </Link>
              ) : (
                <Link className="text-white view-map-btn p-2 d-sm-flex d-none align-items-center gap-3">
                  <span className="d-md-block d-none ps-2">View Map</span>
                  <span className="view-map-btn-scope d-flex align-items-center justify-content-center ">
                    <ScopeIcon />
                  </span>
                </Link>
              )}
              {!Location.pathname?.includes("map") ? (
                <Link
                  to={`${Location.pathname}/map`}
                  className="text-white height-56 view-map-btn p-2 rounded-2 d-flex d-sm-none align-items-center gap-3"
                >
                  <span className="d-md-block d-none ps-2">View Map</span>
                  <span className="view-map-btn-scope w-100 h-100 rounded-2 p-1 d-flex align-items-center justify-content-center ">
                    <ScopeIcon />
                  </span>
                </Link>
              ) : (
                <Link className="text-white height-56 view-map-btn p-2 rounded-2 d-flex d-sm-none align-items-center gap-3">
                  <span className="d-md-block d-none ps-2">View Map</span>
                  <span className="view-map-btn-scope w-100 h-100 rounded-2 p-1 d-flex align-items-center justify-content-center ">
                    <ScopeIcon />
                  </span>
                </Link>
              )}
              <button
                className="border-0 outline-0 bg-transparent p-0 d-sm-block d-none"
                data-bs-toggle="modal"
                data-bs-target="#deactivatemodal"
              >
                <svg
                  className="w-auto h-100"
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

      {/* <div className="container mx-auto ">{children}</div> */}
      <div
        className="modal fade"
        id="deactivatemodal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog custom-model w-max-content modal-dialog-centered mx-auto filter-model">
          <div className="modal-content justify-content-center p-4">
            <div className="d-flex justify-content-end">
              <span className="cr-p" data-bs-dismiss="modal">
                <CrossBorderIcon />
              </span>
            </div>
            <form>
              <div className="d-flex flex-column align-items-start justify-content-center mb-5 mt-4 pt-2">
                <div className="p-0 bg-transparent border-0 mb-4 w-100">
                  <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP}
                    libraries={libraries}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef1.current = ref)}
                      onPlacesChanged={handlePlaceChanged}
                    >
                      <div className="form-control h-auto p-0 bg-transparent border-0">
                        <label className="mb-2 font-weight-600 font-18-100">
                          Search an area
                        </label>
                        <input
                          onChange={(e) =>
                            setFilter((prevState) => ({
                              ...prevState,
                              area: e.target.value,
                            }))
                          }
                          value={filter.area}
                          type="text"
                          className="auth-input bg-white height-42"
                          placeholder="Enter here..."
                          name="area"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </StandaloneSearchBox>
                  </LoadScript>
                </div>
                <div className="d-flex flex-column align-items-start justify-content-center w-100 gap-2 mb-4">
                  <label className="font-weight-600 font-18-100 d-flex justify-content-between w-100">
                    <span className="text-dark">Distance(km)</span>
                    <span className="text-dark">
                      {minMax.minValue}-{minMax.maxValue}
                    </span>
                  </label>
                  <MultiRangeSlider
                    className="shadow-none border-0 py-0 px-2 py-2 w-100"
                    min={0}
                    max={250}
                    minValue={minMax.minValue}
                    maxValue={minMax.maxValue}
                    ruler={false}
                    label={false}
                    barLeftColor="white"
                    barInnerColor="#5D8B2F"
                    barRightColor="white"
                    thumbLeftColor="white"
                    thumbRightColor="white"
                    onInput={handleInput}
                  />
                </div>
                <div className="w-100">
                  <div className="form-control h-auto p-0 bg-transparent border-0 w-100">
                    <label className="mb-2 font-weight-600 font-18-100">
                      Search by Quantity
                    </label>
                    <select
                      className="auth-input bg-white height-42 w-100"
                      required
                      name="quantity"
                      onChange={(e) => formHandler(e)}
                    >
                      <option value={""}>- Select Quantity -</option>
                      <option value={"1-4"}>1-4 Seeds</option>
                      <option value={"5-10"}>5-10 Seeds</option>
                      <option value={"11-15"}>11-15 Seeds</option>
                      <option value={"16-20"}>16-20 Seeds</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center w-100 mt-4 flex-wrap">
                <button
                  className="light-red-btn-outline text-white custom-w min-width-208 height-42"
                  onClick={clearFilterHandler}
                  data-bs-dismiss="modal"
                >
                  Clear Filter
                </button>
                <button
                  className="green-btn-outline text-primary-green custom-w min-width-208 height-42"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="green-btn custom-w min-width-208 height-42"
                  onClick={submitHandler}
                  data-bs-dismiss="modal"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="seeds-card-main row m-0">
        {seeds?.result?.length !== 0 ? (
          (seeds || []).result?.map((data, index) => {
            const imageUrl = data?.photo
              ? `${process.env.REACT_APP_PORT}/${data?.photo}`
              : "http://localhost:4000/undefined";
            const isPlaceholderImage =
              imageUrl === "http://localhost:4000/undefined";
            return (
              <div
                className="col-xl-3 col-lg-4  col-md-6 mb-4 seed-card-col"
                key={index}
              >
                <div className="seed-card position-relative text-black">
                  <div className="row m-0 flex-sm-column w-100">
                    <div className="col-4 col-sm-12 p-0">
                      {isPlaceholderImage ? (
                        <img
                          className="intro-img cards-image-style"
                          src={ImageDummy}
                          alt=""
                        />
                      ) : (
                        <img
                          className="intro-img cards-image-style"
                          src={imageUrl}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="col-8 col-sm-12 p-0">
                      <div className="ps-sm-0 ps-3">
                        <p className="my-sm-4 mb-3 font-24 font-weight-700">
                          {data.productName || data.strainName}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-2">
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                            <DistanceIcon />
                            <span className="cut-text">
                              {data.distance} Away
                            </span>
                          </span>
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50 ">
                            <CountIcon />
                            <span className="cut-text">
                              {data.quantity} Seeds
                            </span>
                          </span>
                        </div>

                        <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2 ">
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
                          <Link
                            to={`/home/userItem/${data._id}`}
                            className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                          >
                            <span>View Profile </span>
                            <span className="icon-green-bg bg-light-green">
                              <FavouriteIcon />
                            </span>
                          </Link>
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
        {seeds.totalRecords > 10 && (
          <div className="d-flex justify-content-center mt-4">
            <PaginationControl
              page={page}
              between={3}
              total={seeds.totalRecords}
              limit={seeds.limit}
              changePage={(page) => pageHandler(page)}
              ellipsis={1}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Seeds;
