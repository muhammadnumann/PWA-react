import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Axios from "../../axios/Axios";
import { useState } from "react";
import GoogleMapNew from "./GoogleMap/GoogleMapNew";
import EmptyDataImage from "../../assets/Images/EmptyData";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

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

const libraries = ["places"];
const HeadShopMap = () => {
  const [activeMarker, setActiveMarker] = useState(null);
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

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
  const GetAllProduct = async (GetAllProductUrl) => {
    try {
      const fetchData = await Axios.get(GetAllProductUrl);
      setHeadShop(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const submitHandler = (event) => {
    event.preventDefault();
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/getDataByRadius?${
      filter.radius > 0 ? `&radius=${filter.radius}` : ""
    }${filter.quantity ? `&quantity=${filter.quantity}` : ""}${
      filter.area
        ? `&address=${filter.area}`
        : `&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`
    }&category=headShop`;
    GetAllProduct(GetAllProductUrl);
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

  const [headShop, setHeadShop] = useState([]);
  const routeParams = useParams();

  const GetHeadShop = async (GetHeadShopUrl) => {
    try {
      const fetchData = await Axios.get(GetHeadShopUrl);
      setHeadShop(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetHeadShopUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&`
        : `getAllData/?`
    }category=headShop&userType=retailer&latlang=${
      data?.location?.coordinates[0]
    },${data?.location?.coordinates[1]}`;
    GetHeadShop(GetHeadShopUrl);
  }, []);

  const clearFilterHandler = (e) => {
    e.preventDefault();
    setFilter({
      radius: 0,
      area: "",
      quantity: "",
    });
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetHeadshopUrl = `${process.env.REACT_APP_API_URI}users/getAllData/?category=headShop&userType=retailer&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    GetHeadShop(GetHeadshopUrl);
  };

  return (
    <div className="ms-12 me-12">
      <div className="allproduct-mob d-block">
        <div className="container mx-auto mb-5 ">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h2 className="allproduct-heading">All Dispensary</h2>
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
      {headShop?.result?.length !== 0 ? (
        <div className="row flex-md-row flex-column-reverse m-0 seed-card p-0 flex-row ps-12 pe-12">
          <div className="col-12 p-0 mb-md-0">
            {seedsDetail.map((chatsdetail, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    chatsdetail.active ? "active show" : ""
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
                        {headShop.length} People Sharing Seeds
                      </button>
                    </div>
                    <GoogleMapNew
                      markersData={headShop.result}
                      activeMarker={activeMarker}
                      setActiveMarker={setActiveMarker}
                      handleActiveMarker={handleActiveMarker}
                      isMarkerShown
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center w-100">
          <EmptyDataImage />
        </div>
      )}
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
                  <label className="font-weight-600 font-18-100">
                    Distance
                  </label>
                  <input
                    type="range"
                    className="form-control-range w-100"
                    min="0"
                    max="50"
                    step="10"
                    name="radius"
                    value={filter.radius}
                    onChange={(e) => formHandler(e)}
                  ></input>
                  <p className="rangetext d-flex w-100 justify-content-between ">
                    <span>All</span>
                    <span></span>
                    <span>0-10km</span>
                    <span>0-20km</span>
                    <span>0-30km</span>
                    <span>0-40km</span>
                    <span>0-50km</span>
                  </p>
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
    </div>
  );
};

export default HeadShopMap;
