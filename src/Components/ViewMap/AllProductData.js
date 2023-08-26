import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import GoogleMapNew from "./GoogleMap/GoogleMapNew";
import { toast } from "react-toastify";
import Axios from "../../axios/Axios";
import SearchButtonIcon from "../../assets/Images/Search";
import ScopeIcon from "../../assets/Images/Scope";
import MobSearchIcon from "../../assets/Images/MobSearch";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import FilterIcon from "../../assets/Images/filterIcon";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import MultiRangeSlider from "multi-range-slider-react";
import { useRef } from "react";
const libraries = ["places"];

const AllProductMapView = () => {
  const [activeMarker, setActiveMarker] = useState(null);
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchedTerm = useDebounce(searchTerm);
  const [type, setType] = useState("Seeds");
  const [allProduct, setAllProduct] = useState([]);
  const [categoryFilter, setcategoryFilter] = useState([]);
  const inputRef1 = useRef();
  const [quantityFilter, setQuantityFilter] = useState("");
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") || "retailer"
  );
  const [filter, setFilter] = useState({
    radius: 0,
    area: "",
    quantity: "",
  });

  const [options, setOptions] = useState([
    {
      id: 1,
      value: "all",
      label: "All",
      userType: "retailer",
    },
    {
      id: 2,
      value: "seedStore",
      label: "Seed",
      userType: "retailer",
    },
    {
      id: 3,
      value: "dispensary",
      label: "Dispensary",
      userType: "retailer",
    },
    {
      id: 4,
      value: "cannabisLounge",
      label: "Cannabis Lounge",
      userType: "retailer",
    },
    {
      id: 5,
      value: "headShop",
      label: "Head Shop",
      userType: "retailer",
    },
    {
      id: 6,
      value: "growDepot",
      label: "Grow Depot",
      userType: "retailer",
    },
    {
      id: 1,
      value: "all",
      label: "All",
      userType: "consumer",
    },
    {
      id: 2,
      value: "Sativa",
      label: "Sativa",
      userType: "consumer",
    },
    {
      id: 3,
      value: "Indica",
      label: "Indica",
      userType: "consumer",
    },
    {
      id: 4,
      value: "Hybrid",
      label: "Hybrid",
      userType: "consumer",
    },
    {
      id: 5,
      value: "CBD",
      label: "CBD",
      userType: "consumer",
    },
  ]);

  const GetAllProduct = async (GetAllProductUrl) => {
    try {
      const fetchData = await DashboardAxios.get(GetAllProductUrl);
      setAllProduct(fetchData.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };
  const GetAllProductUseEffect = async (GetAllProductUrl) => {
    try {
      const fetchData = await Axios.get(GetAllProductUrl);
      setAllProduct(fetchData.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/${`getAllData/?name=${searchTerm}&`}latlang=${
      data?.location?.coordinates[0]
    },${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;

    GetAllProductUseEffect(GetAllProductUrl);
  }, [debouncedSearchedTerm]);

  const userTyperHandler = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
    setcategoryFilter([]);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/${`getAllData/?name=${searchTerm}&`}latlang=${
      data?.location?.coordinates[0]
    },${data?.location?.coordinates[1]}&userType=${type}&category=`;
    GetAllProduct(GetAllProductUrl);
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/${`getAllData/?`}latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;
    GetAllProductUseEffect(GetAllProductUrl);
  }, []);

  useEffect(() => {
    handleCheckboxChange({ target: { value: "all", checked: true } });
  }, []);
  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    if (value === "all") {
      setcategoryFilter(checked ? [""] : []);
      const updatedOptions = options.map((option) => ({
        ...option,
        checked: option.value === "all" ? checked : false,
      }));
      setOptions(updatedOptions);
    } else {
      const updatedOptions = options.map((option) =>
        option.value === value ? { ...option, checked } : option
      );
      setOptions(updatedOptions);

      if (checked) {
        setcategoryFilter((prevArray) => [...prevArray, value]);
      } else {
        setcategoryFilter((prevStrings) =>
          prevStrings.filter((string) => string !== value)
        );
      }
      if (categoryFilter.includes("")) {
        setOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.value === "all" ? { ...option, checked: false } : option
          )
        );
        setcategoryFilter((prevStrings) =>
          prevStrings.filter((string) => string !== "")
        );
      }
    }
  }

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/${`getAllData/?`}latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;
    GetAllProduct(GetAllProductUrl);
  }, [categoryFilter]);

  const DashboardAxios = axios.create({
    baseURL: "http://localhost:4000/api/v1/",
  });

  DashboardAxios.interceptors.request.use((request) => {
    document.querySelector(".loader-main").style.display = "block";
    return request;
  });

  DashboardAxios.interceptors.response.use(
    (response) => {
      document.querySelector(".loader-main").style.display = "none";
      return response;
    },
    (error) => {
      document.querySelector(".loader-main").style.display = "none";
      throw error;
    }
  );

  useEffect(() => {
    const hasDispensary = categoryFilter.includes("dispensary");
    const hasSeedStore = categoryFilter.includes("seedStore");
    const hasBoth = hasDispensary && hasSeedStore;
    // console.log(hasBoth);
    // console.log(quantityFilter);

    if (hasDispensary) {
      setQuantityFilter("dispensary");
      setType("grams");
    }
    if (hasSeedStore) {
      setQuantityFilter("seedStore");
      setType("Seeds");
    }
    if (hasBoth || categoryFilter === "") {
      setQuantityFilter("all");
      setType("Seeds");
    }
  }, [categoryFilter]);

  const submitHandler = (event) => {
    console.log(filter);

    event.preventDefault();
    const { name, value } = event.target;
    if (name === "quantity") {
      setFilter((prevState) => ({
        ...prevState,
        quantity: value,
      }));
      const currentUser = localStorage.getItem("userdata");
      let data = JSON.parse(currentUser);
      let GetAllProductUrl = `${
        process.env.REACT_APP_API_URI
      }users/getDataByRadius?userType=${userType}&${
        filter.radius > 0 ? `&radius=${filter.radius}` : ""
      }${`&quantity=${value}`}${
        filter.area
          ? `&address=${filter.area}`
          : `&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`
      }&category=${categoryFilter?.join(",")}`;
      GetAllProduct(GetAllProductUrl);
    } else {
      const currentUser = localStorage.getItem("userdata");
      let data = JSON.parse(currentUser);
      let GetAllProductUrl = `${
        process.env.REACT_APP_API_URI
      }users/getDataByRadius?userType=${userType}&${
        filter.radius > 0 ? `&radius=${filter.radius}` : ""
      }${filter.quantity ? `&quantity=${filter.quantity}` : ""}${
        filter.area
          ? `&address=${filter.area}`
          : `&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`
      }&category=${categoryFilter?.join(",")}`;
      GetAllProduct(GetAllProductUrl);
    }
  };
  const clearFilterHandler = (e) => {
    e.preventDefault();
    setFilter({
      radius: 0,
      area: "",
      quantity: "",
    });
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${
      process.env.REACT_APP_API_URI
    }users/getAllData/?category=${categoryFilter?.join(
      ","
    )}&userType=${userType}&name=${searchTerm}&latlang=${
      data?.location?.coordinates[0]
    },${data?.location?.coordinates[1]}`;
    GetAllProduct(GetAllProductUrl);
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
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handlePlaceChanged = () => {
    const [place] = inputRef1.current.getPlaces();
    if (place) {
      setFilter((prevState) => ({
        ...prevState,
        area: place.formatted_address,
      }));
    }
  };
  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="all-product-section ">
      <div className="allproduct-mob d-block">
        <div className="container mx-auto">
          <div className="d-flex flex-sm-row flex-column align-items-sm-center justify-content-between gap-4 ps-12 pe-12">
            <div className="d-flex align-items-center gap-sm-4 gap-2 justify-content-between">
              <h2 className="allproduct-heading">All Products</h2>
              <div
                className="btn-group btn-group-toggle height-56px btn-group-dash"
                data-toggle="buttons"
              >
                <label
                  className={`btn font-14 bg-grey d-flex align-items-center px-sm-3 px-2 ${
                    userType === "retailer" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="options"
                    id="Grams"
                    autoComplete="off"
                    readOnly
                    checked={userType === "retailer"}
                    value="retailer"
                    onChange={(e) => userTyperHandler(e.target.value)}
                  />
                  <span>Retailer</span>
                </label>
                <label
                  className={`btn font-14 bg-grey d-flex align-items-center px-sm-3 px-2 ${
                    userType === "consumer" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="options"
                    id="Seeds"
                    value="consumer"
                    autoComplete="off"
                    checked={userType === "consumer"}
                    onChange={(e) => userTyperHandler(e.target.value)}
                  />
                  <span>Consumer</span>
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center gap-sm-4 gap-3">
              <div className="search-product d-sm-none d-flex">
                <input
                  placeholder="Search Product"
                  type="text"
                  className="border-0 outline-0 bg-transparent w-100"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
                <span className="icon-green-bg">
                  <MobSearchIcon />
                </span>
              </div>

              <div className="d-flex align-items-center w-max-content gap-sm-4 gap-3">
                <div className="d-md-flex d-sm-none d-flex align-items-center w-max-content">
                  <button
                    className="border-0 outline-0 bg-transparent p-0 height-56"
                    data-bs-toggle="modal"
                    data-bs-target="#deactivatemodal"
                  >
                    <FilterIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-sm-5 mt-4 mb-5 gap-4 d-flex align-items-start justify-content-between ps-12 pe-12">
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
            <div className="d-flex gap-3 overflow-x-auto all-products-link">
              {options.map((option) => {
                if (userType === option.userType) {
                  return (
                    <label
                      key={option.value}
                      className={`product-item cr-p ${
                        option.checked ? "active" : ""
                      }`}
                    >
                      <input
                        disabled={option.disabled}
                        className="d-none"
                        type="checkbox"
                        value={option.value}
                        checked={option.checked}
                        onChange={handleCheckboxChange}
                      />
                      {option.icon} {option.label}
                    </label>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="loader-main">
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="row flex-md-row flex-column-reverse seed-card p-0 flex-row ms-12 me-12">
          <div className="col-12 p-0 mb-md-0">
            <div className="map-container">
              <div
                className={`active show tab-pane h-100 w-100 fade  chat-detail`}
              >
                <div
                  style={{ height: "100%", width: "100%" }}
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
                      {allProduct.length} People Sharing Seeds
                    </button>
                  </div>
                  <GoogleMapNew
                    markersData={allProduct.result}
                    activeMarker={activeMarker}
                    setActiveMarker={setActiveMarker}
                    handleActiveMarker={handleActiveMarker}
                    isMarkerShown
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* filter modal */}
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
            <div className="d-flex justify-content-between align-items-center">
              <p className="font-32 font-weight-800 text-center">
                Filter your search
              </p>
              <span className="cr-p" data-bs-dismiss="modal">
                <CrossBorderIcon />
              </span>
            </div>
            <form>
              <div className="d-flex flex-column align-items-start justify-content-center mt-4 pt-2">
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
                  {/* <label className="font-weight-600 font-18-100">
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
                      onChange={(e) =>
                        setFilter((prevState) => ({
                          ...prevState,
                          radius: e.target.value,
                        }))
                      }
                    ></input>
                    <p className="rangetext d-flex w-100 justify-content-between ">
                      <span>All</span>
                      <span></span>
                      <span>0-10km</span>
                      <span>0-20km</span>
                      <span>0-30km</span>
                      <span>0-40km</span>
                      <span>0-50km</span>
                    </p> */}
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
              </div>

              <div className="gap-3 mb-3">
                {quantityFilter === "all" || quantityFilter === "" ? (
                  <div
                    className="btn-group btn-group-toggle height-42 mb-4 btn-group-dash"
                    data-toggle="buttons"
                  >
                    <label className="btn font-14 bg-grey active d-flex align-items-center py-3 px-sm-3 px-2">
                      <input
                        type="radio"
                        name="options"
                        id="Grams"
                        autoComplete="off"
                        readOnly
                        checked={type === "Grams"}
                        onChange={handleChange}
                        value="Grams"
                      />
                      <span className="pl-2">Grams</span>
                    </label>
                    <label className="btn font-14 bg-grey d-flex align-items-center px-sm-3 px-2">
                      <input
                        type="radio"
                        name="options"
                        id="Seeds"
                        value="Seeds"
                        autoComplete="off"
                        checked={type === "Seeds"}
                        onChange={handleChange}
                      />
                      <span className="pl-2">Seeds</span>
                    </label>
                  </div>
                ) : (
                  ""
                )}
                <div className="form-control h-auto p-0 mb-5 bg-transparent border-0">
                  <select
                    className="auth-input bg-white height-42 m-0"
                    required
                    name="quantity"
                    onChange={(e) => formHandler(e)}
                  >
                    <option value={""}>- Search by Quantity -</option>
                    <option value={type === "Seeds" ? "1-4" : "1-7"}>
                      {type === "Seeds" ? "1-4 Seeds" : "1-7 Grams"}
                    </option>
                    <option value={type === "Seeds" ? "5-10" : "7-14"}>
                      {type === "Seeds" ? "5-10 Seeds" : "7-14 Grams"}
                    </option>
                    <option value={type === "Seeds" ? "11-15" : "14-30"}>
                      {type === "Seeds" ? "11-15 Seeds" : "14-30 Grams"}
                    </option>
                    {type === "Seeds" && (
                      <option value={"16-20"}>{"15-20 Seeds"}</option>
                    )}
                  </select>
                </div>
                <div className="d-none d-sm-flex d-md-none align-items-center gap-4 w-max-content">
                  <button
                    className="border-0 outline-0 bg-transparent p-0 height-56"
                    data-bs-toggle="modal"
                    data-bs-target="#deactivatemodal"
                  >
                    <FilterIcon />
                  </button>
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
                  onClick={(e) => submitHandler(e)}
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

export default AllProductMapView;
