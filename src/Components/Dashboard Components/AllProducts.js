import React, { useRef, useState, useEffect } from "react";
import ScopeIcon from "../../assets/Images/Scope";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchButtonIcon from "../../assets/Images/Search";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import useDebounce from "../../hooks/useDebounce";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import HeartIcon from "../../assets/Images/Heart";
import DistanceIcon from "../../assets/Images/Distance";
import CountIcon from "../../assets/Images/Count";
import PriceIcon from "../../assets/Images/Price";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import RatingIcon from "../../assets/Images/Rating";
import LocationIcon from "../../assets/Images/Location";
import TimerIcon from "../../assets/Images/Timer";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { PaginationControl } from "react-bootstrap-pagination-control";
import MobSearchIcon from "../../assets/Images/MobSearch";
import ImageDummy from "../../assets/Images/match/dummy.png";
import axios from "axios";
import DispensaryFlower from "../../assets/Images/DispensaryFlower";
import BudsType from "../../assets/Images/BudsType";
import FlavorIcon from "../../assets/Images/Flavor";
import MultiRangeSlider from "multi-range-slider-react";
import FilterIcon from "../../assets/Images/filterIcon";
const libraries = ["places"];

const AllProductsDashboard = (props) => {
  const Location = useLocation();
  const [type, setType] = useState("Seeds");
  const [categoryFilter, setcategoryFilter] = useState([]);
  const [data, setData] = useState([]);
  const routeParams = useParams();
  const [currentuserData, setcurrentuserData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchedTerm = useDebounce(searchTerm);
  const [page, setPage] = useState(1);
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
      active: true,
    },
    {
      id: 2,
      value: "seedStore",
      label: "Seed",
      userType: "retailer",
      active: true,
    },
    {
      id: 3,
      value: "dispensary",
      label: "Dispensary",
      userType: "retailer",
      active: true,
    },
    {
      id: 4,
      value: "cannabisLounge",
      label: "Cannabis Lounge",
      userType: "retailer",
      active: true,
    },
    {
      id: 5,
      value: "headShop",
      label: "Head Shop",
      userType: "retailer",
      active: true,
    },
    {
      id: 6,
      value: "growDepot",
      label: "Grow Depot",
      userType: "retailer",
      active: true,
    },
    {
      id: 1,
      value: "all",
      label: "All",
      userType: "consumer",
      active: true,
    },
    {
      id: 2,
      value: "Sativa",
      label: "Sativa",
      userType: "consumer",
      active: true,
    },
    {
      id: 3,
      value: "Indica",
      label: "Indica",
      userType: "consumer",
      active: true,
    },
    {
      id: 4,
      value: "Hybrid",
      label: "Hybrid",
      userType: "consumer",
      active: true,
    },
    {
      id: 5,
      value: "CBD",
      label: "CBD",
      userType: "consumer",
      active: true,
    },
  ]);
  const GetAllProduct = async (GetAllProductUrl) => {
    try {
      const fetchData = await DashboardAxios.get(GetAllProductUrl);
      setData(fetchData.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };
  const GetAllProductUseEffect = async (GetAllProductUrl) => {
    try {
      const fetchData = await Axios.get(GetAllProductUrl);
      setData(fetchData.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    localStorage.removeItem("signupData");
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&page=${page}&userType=${userType}&name=${searchTerm}&`
        : `getAllData/?page=${page}&name=${searchTerm}&`
    }latlang=${data?.location?.coordinates[0]},${
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
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&page=${page}&userType=${userType}&name=${searchTerm}&`
        : `getAllData/?page=${page}&name=${searchTerm}&`
    }latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${type}&category=`;
    GetAllProduct(GetAllProductUrl);
  };

  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const inputRef = useRef();
  // // console.log(categoryFilter);
  // if (categoryFilter.length === 1 && categoryFilter[0] === "dispensary") {
  //   console.log('Only "dispensary" filter is applied.');
  // } else {
  //   console.log("Other filters are also applied.");
  // }
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

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&page=1&`
        : `getAllData/?page=1&`
    }latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;
    GetAllProductUseEffect(GetAllProductUrl);
  }, []);

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
      }users/getDataByRadius?page=${page}&userType=${userType}${
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
      }users/getDataByRadius?page=${page}&userType=${userType}${
        filter.radius > 0 ? `&radius=${filter.radius}` : ""
      }${filter.quantity ? `&quantity=${filter.quantity}` : ""}${
        filter.area
          ? `&address=${filter.area}`
          : `&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`
      }&category=${categoryFilter?.join(",")}`;
      GetAllProduct(GetAllProductUrl);
    }
  };

  const pageHandler = (page) => {
    setPage(page);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&page=${page}&userType=${userType}&`
        : `getAllData/?page=${page}&`
    }latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;
    GetAllProduct(GetAllProductUrl);
  };

  const favouriteHandler = (userId, prodId, categry) => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const markdata = {
      userId: userId,
      pId: prodId,
      category: categry,
      latlang: `${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`,
    };
    axios
      .post(`${process.env.REACT_APP_API_URI}users/markFavourite`, markdata)
      .then((response) => {
        setData((prevState) => ({
          ...prevState,
          result: prevState.result.map((product) => {
            if (product?._id === response?.data?.findproduct?._id) {
              return response?.data?.findproduct;
            } else {
              return product;
            }
          }),
        }));
        toast.success(response.data?.messgae);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
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
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/${
      routeParams.radius
        ? `getDataByRadius?${routeParams.radius}&page=1&`
        : `getAllData/?page=1&`
    }latlang=${data?.location?.coordinates[0]},${
      data?.location?.coordinates[1]
    }&userType=${userType}&category=${categoryFilter?.join(",")}`;
    GetAllProduct(GetAllProductUrl);
  }, [categoryFilter]);

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
    }users/getAllData/?page=${page}&category=${categoryFilter?.join(
      ","
    )}&userType=${userType}&name=${searchTerm}&latlang=${
      data?.location?.coordinates[0]
    },${data?.location?.coordinates[1]}`;
    GetAllProduct(GetAllProductUrl);
  };

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

  return (
    <>
      <div className="all-product-section ">
        <div className="allproduct-mob d-block">
          <div className="container mx-auto">
            <div className="d-flex flex-sm-row flex-column align-items-sm-center justify-content-between gap-4 ps-12 pe-12">
              <div className="d-flex align-items-center align-items-sm-start align-items-md-center w-100-sm-md flex-md-row flex-sm-column gap-sm-4 gap-2 justify-content-between">
                <h2 className="allproduct-heading">All Products</h2>
                <div
                  className="btn-group btn-group-toggle height-56px btn-group-dash d-flex d-sm-none d-md-flex"
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
                <div className="d-sm-flex d-md-none d-none align-items-center justify-content-between gap-sm-4 gap-3 w-100">
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
                      {!Location.pathname.includes("map") ? (
                        <Link
                          to={`${Location.pathname}/map`}
                          className="text-white view-map-btn p-2 d-sm-flex d-none align-items-center gap-3"
                        >
                          <span className="d-md-block d-none ps-2">
                            View Map
                          </span>
                          <span className="view-map-btn-scope d-flex align-items-center  justify-content-center ">
                            <ScopeIcon />
                          </span>
                        </Link>
                      ) : (
                        <Link className="text-white view-map-btn p-2 d-sm-flex d-none align-items-center gap-3">
                          <span className="d-md-block d-none ps-2">
                            View Map
                          </span>
                          <span className="view-map-btn-scope d-flex align-items-center justify-content-center ">
                            <ScopeIcon />
                          </span>
                        </Link>
                      )}

                      <div className="d-flex align-items-center w-max-content">
                        <button
                          className="border-0 outline-0 bg-transparent p-0 height-56"
                          data-bs-toggle="modal"
                          data-bs-target="#deactivatemodal"
                        >
                          <FilterIcon />
                        </button>
                      </div>
                      {!Location.pathname.includes("map") ? (
                        <Link
                          to={`${Location.pathname}/map`}
                          className="text-white view-map-btn p-2 d-flex d-sm-none align-items-center gap-3 height-56 rounded-3"
                        >
                          <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-3">
                            <ScopeIcon />
                          </span>
                        </Link>
                      ) : (
                        <Link className="text-white view-map-btn p-2 d-flex d-sm-none align-items-center gap-3 height-56 rounded-3">
                          <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-3">
                            <ScopeIcon />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex d-sm-none d-md-flex align-items-center gap-sm-4 gap-3">
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
                  {!Location.pathname.includes("map") ? (
                    <Link
                      to={`${Location.pathname}/map`}
                      className="text-white view-map-btn p-2 d-sm-flex d-none align-items-center gap-3"
                    >
                      <span className="d-md-block d-none ps-2">View Map</span>
                      <span className="view-map-btn-scope d-flex align-items-center  justify-content-center ">
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

                  <div className="d-flex align-items-center w-max-content">
                    <button
                      className="border-0 outline-0 bg-transparent p-0 height-56"
                      data-bs-toggle="modal"
                      data-bs-target="#deactivatemodal"
                    >
                      <FilterIcon />
                    </button>
                  </div>
                  {!Location.pathname.includes("map") ? (
                    <Link
                      to={`${Location.pathname}/map`}
                      className="text-white view-map-btn p-2 d-flex d-sm-none align-items-center gap-3 height-56 rounded-3"
                    >
                      <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-3">
                        <ScopeIcon />
                      </span>
                    </Link>
                  ) : (
                    <Link className="text-white view-map-btn p-2 d-flex d-sm-none align-items-center gap-3 height-56 rounded-3">
                      <span className="view-map-btn-scope d-flex align-items-center justify-content-center h-100 w-max-content p-1 rounded-3">
                        <ScopeIcon />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="d-flex gap-3 justify-content-between align-items-center ps-12 pe-12 mt-4 mb-3">
              {quantityFilter === "all" || quantityFilter === "" ? (
                <div
                  className="btn-group btn-group-toggle height-56 btn-group-dash"
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
              <div className="form-control h-auto p-0 bg-transparent border-0 w-max-content ">
                <select
                  className="auth-input bg-white height-56 m-0 pe-5 rounded-16"
                  required
                  name="quantity"
                  onChange={(e) => {
                    submitHandler(e);
                  }}
                >
                  <option value={""}>- Search by Quantity -</option>
                  <option value={type === "Seeds" ? "1-5" : "1-7"}>
                    {type === "Seeds" ? "1-5 Seeds" : "1-7 Grams"}
                  </option>
                  <option value={type === "Seeds" ? "5-10" : "7-14"}>
                    {type === "Seeds" ? "5-10 Seeds" : "7-14 Grams"}
                  </option>
                  <option value={type === "Seeds" ? "10-15" : "14-30"}>
                    {type === "Seeds" ? "10-15 Seeds" : "14-30 Grams"}
                  </option>
                  {type === "Seeds" && (
                    <option value={"15-20"}>{"15-20 Seeds"}</option>
                  )}
                  {type === "Seeds" && (
                    <option value={"20-30"}>{"20-30 Seeds"}</option>
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
            </div> */}

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

        <div className="container mx-auto ">
          <div className="seeds-card-main row m-0">
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
            {data?.result?.length !== 0 ? (
              (data || []).result?.map((data, index) => {
                const imageUrl = data?.photo
                  ? `${process.env.REACT_APP_PORT}/${data?.photo}`
                  : "http://localhost:4000/undefined";
                const isPlaceholderImage =
                  imageUrl === "http://localhost:4000/undefined";
                return (
                  <div
                    className="col-xl-3 col-lg-4  col-md-6 mb-4 seed-card-col h-100"
                    key={index}
                  >
                    <div className="seed-card h-100 position-relative">
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
                          {userType === "retailer" && (
                            <span
                              className="like-post cr-p"
                              onClick={() =>
                                favouriteHandler(
                                  currentuserData?._id,
                                  data?._id,
                                  data?.category
                                )
                              }
                            >
                              {data?.favourite &&
                              data?.favourite.includes(currentuserData?._id) ? (
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
                              ) : (
                                <HeartIcon />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="col-8 col-sm-12 p-0">
                          <div className="ps-sm-0 ps-3">
                            <p className="my-sm-4 mb-3 font-24 font-weight-700">
                              {data?.strainName ||
                                data?.productName ||
                                data?.brandName ||
                                data?.accessories ||
                                data?.name}
                            </p>
                            {data?.userId?.retailerType === "dispensary" ? (
                              <>
                                <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                  <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                    <DistanceIcon />
                                    <span className="cut-text">
                                      {data?.distance} Away
                                    </span>
                                  </span>

                                  <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                    <DispensaryFlower />
                                    <span className="cut-text">
                                      {data?.userId?.storeName}
                                    </span>
                                  </span>
                                </div>

                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                  <LocationIcon />
                                  <span className="cut-text">
                                    {data?.userId?.location?.address}
                                  </span>
                                </span>

                                <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                  <div className="d-flex gap-2 align-items-center flex-wrap">
                                    <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                      <RatingIcon />
                                      {data?.userId?.ratingsAverage}
                                    </span>
                                    <span className="font-14-100 text-grey font-weight-400">
                                      ({data?.userId?.ratingsQuantity} Reviews)
                                    </span>
                                  </div>
                                  <Link
                                    to={`/home/${
                                      userType === "retailer"
                                        ? data?.category
                                        : "userItem"
                                    }/${data?._id}`}
                                    className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                                  >
                                    <span>View Product </span>
                                    <span className="icon-green-bg bg-light-green">
                                      <FavouriteIcon />
                                    </span>
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <>
                                {data?.userId?.retailerType === "headshop" ? (
                                  <>
                                    <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                        <PriceIcon />
                                        <span className="cut-text">
                                          Price: {`$${data?.cost}`}
                                        </span>
                                      </span>
                                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                        <FlavorIcon />
                                        <span className="cut-text">
                                          Flavour: Mint
                                        </span>
                                      </span>
                                    </div>
                                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                      <LocationIcon />
                                      <span className="cut-text">
                                        {data?.userId?.location?.address}
                                      </span>
                                    </span>
                                    <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                      <div className="d-flex gap-2 align-items-center flex-wrap">
                                        <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                          <RatingIcon />
                                          {data?.userId?.ratingsAverage}
                                        </span>
                                        <span className="font-14-100 text-grey font-weight-400">
                                          ({data?.userId?.ratingsQuantity}{" "}
                                          Reviews)
                                        </span>
                                      </div>
                                      <Link
                                        to={`/home/${
                                          userType === "retailer"
                                            ? data?.category
                                            : "userItem"
                                        }/${data?._id}`}
                                        className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                                      >
                                        <span>View Product </span>
                                        <span className="icon-green-bg bg-light-green">
                                          <FavouriteIcon />
                                        </span>
                                      </Link>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {data?.userId?.retailerType ===
                                    "cannabis" ? (
                                      <>
                                        <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                            <DistanceIcon />
                                            <span className="cut-text">
                                              {data?.distance} Away
                                            </span>
                                          </span>
                                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                            <PriceIcon />
                                            <span className="cut-text">
                                              Fees: {`$${data?.entryFee}`}
                                            </span>
                                          </span>
                                        </div>
                                        <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                          <LocationIcon />
                                          <span className="cut-text">
                                            {data?.userId?.location?.address}
                                          </span>
                                        </span>

                                        <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                          <div className="d-flex gap-2 align-items-center flex-wrap">
                                            <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                              <RatingIcon />
                                              {data?.userId?.ratingsAverage}
                                            </span>
                                            <span className="font-14-100 text-grey font-weight-400">
                                              ({data?.userId?.ratingsQuantity}{" "}
                                              Reviews)
                                            </span>
                                          </div>
                                          <Link
                                            to={`/home/${
                                              userType === "retailer"
                                                ? data?.category
                                                : "userItem"
                                            }/${data?._id}`}
                                            className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                                          >
                                            <span>View Product </span>
                                            <span className="icon-green-bg bg-light-green">
                                              <FavouriteIcon />
                                            </span>
                                          </Link>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {data?.userId?.retailerType ===
                                        "seedbank" ? (
                                          <>
                                            <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                                <DistanceIcon />
                                                <span className="cut-text">
                                                  {data?.distance} Away
                                                </span>
                                              </span>
                                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                                <CountIcon />
                                                <span className="cut-text">
                                                  {data?.quantity} Seeds
                                                </span>
                                              </span>
                                            </div>

                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                              <LocationIcon />
                                              <span className="cut-text">
                                                {
                                                  data?.userId?.location
                                                    ?.address
                                                }
                                              </span>
                                            </span>

                                            <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                              <div className="d-flex gap-2 align-items-center flex-wrap">
                                                <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                                  <RatingIcon />
                                                  {data?.userId?.ratingsAverage}
                                                </span>
                                                <span className="font-14-100 text-grey font-weight-400">
                                                  (
                                                  {
                                                    data?.userId
                                                      ?.ratingsQuantity
                                                  }{" "}
                                                  Reviews)
                                                </span>
                                              </div>
                                              <Link
                                                to={`/home/${
                                                  userType === "retailer"
                                                    ? data?.category
                                                    : "userItem"
                                                }/${data?._id}`}
                                                className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                                              >
                                                <span>View Product </span>
                                                <span className="icon-green-bg bg-light-green">
                                                  <FavouriteIcon />
                                                </span>
                                              </Link>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                                <DistanceIcon />
                                                <span className="cut-text">
                                                  {data?.distance} Away
                                                </span>
                                              </span>
                                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                                <BudsType />
                                                <span className="cut-text">
                                                  Type : {data?.productType}
                                                </span>
                                              </span>
                                            </div>

                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                              <LocationIcon />
                                              <span className="cut-text">
                                                {
                                                  data?.userId?.location
                                                    ?.address
                                                }
                                              </span>
                                            </span>

                                            <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                              <div className="d-flex gap-2 align-items-center flex-wrap">
                                                <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                                  <RatingIcon />
                                                  {data?.userId?.ratingsAverage}
                                                </span>
                                                <span className="font-14-100 text-grey font-weight-400">
                                                  (
                                                  {
                                                    data?.userId
                                                      ?.ratingsQuantity
                                                  }{" "}
                                                  Reviews)
                                                </span>
                                              </div>
                                              <Link
                                                to={`/home/${
                                                  userType === "retailer"
                                                    ? data?.category
                                                    : "userItem"
                                                }/${data?._id}`}
                                                className="green-btn-outline bg-primary-green text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                                              >
                                                <span>View Product </span>
                                                <span className="icon-green-bg bg-light-green">
                                                  <FavouriteIcon />
                                                </span>
                                              </Link>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}

                            {data?.timing && (
                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500  mb-sm-3 mb-2">
                                <TimerIcon />
                                {data?.timing}
                              </span>
                            )}
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
            {data?.totalRecords > 10 && (
              <div className="d-flex justify-content-center mt-4">
                <PaginationControl
                  page={page}
                  between={3}
                  total={data?.totalRecords}
                  limit={data?.limit}
                  changePage={(page) => pageHandler(page)}
                  ellipsis={1}
                />
              </div>
            )}
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
    </>
  );
};

export default AllProductsDashboard;
