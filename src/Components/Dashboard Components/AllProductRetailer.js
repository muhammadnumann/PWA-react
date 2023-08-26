import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SeedICon from "../../assets/Images/Seed";
import CannbisIcon from "../../assets/Images/Cannbis";
import HeadShopIcon from "../../assets/Images/HeadShop";
import DispensaryIcon from "../../assets/Images/Dispensary";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import useDebounce from "../../hooks/useDebounce";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import DistanceIcon from "../../assets/Images/Distance";
import CountIcon from "../../assets/Images/Count";
import PriceIcon from "../../assets/Images/Price";
import RatingIcon from "../../assets/Images/Rating";
import LocationIcon from "../../assets/Images/Location";
import TimerIcon from "../../assets/Images/Timer";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { PaginationControl } from "react-bootstrap-pagination-control";
import ImageDummy from "../../assets/Images/match/dummy.png";
import AddIcon from "../../assets/Images/Add";
import DispensaryFrom from "../../Components/FilterForm/DispensaryFrom";
import SeedstoreForm from "../../Components/FilterForm/SeedstoreForm";
import HeadshopForm from "../../Components/FilterForm/HeadshopForm";
import CannbisFrom from "../../Components/FilterForm/CannbisFrom";
import Growndepot from "../FilterForm/Growndepot";
import BudsType from "../../assets/Images/BudsType";
import FlavorIcon from "../../assets/Images/Flavor";
import DispensaryFlower from "../../assets/Images/DispensaryFlower";
const libraries = ["places"];

const AllProductsRetailer = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const Location = useLocation();
  const [type, setType] = useState("Grams");
  const [data, setData] = useState([]);
  const [currentuserData, setcurrentuserData] = useState();
  const [page, setPage] = useState(1);
  const inputRef1 = useRef();
  const filtertheFilter = ["/home/cannabis", "/home/headshops"];
  const [userType, setUserType] = useState("retailer");
  const [filter, setFilter] = useState({
    radius: 0,
    area: "",
    quantity: "",
  });

  const GetAllProduct = async (GetAllProductUrl) => {
    try {
      const fetchData = await Axios.get(GetAllProductUrl);
      console.log(fetchData.data);
      setData(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    localStorage.removeItem("signupData");
  }, []);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const inputRef = useRef();

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/getAllData?page=${page}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}&userType=${userType}&userId=${data._id}`;
    GetAllProduct(GetAllProductUrl);
  }, []);

  const addNewhandler = () => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/getAllData?page=${page}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}&userType=${userType}&userId=${data._id}`;
    GetAllProduct(GetAllProductUrl);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const hasRadius = "radius" in params;
    console.log(hasRadius);
    if (hasRadius) {
      console.log("hasRadius");
      let url = window.location.href;
      let modifiedUrl = url.split("radius=")[0];
      const params = new URLSearchParams();
      params.set("radius", filter.radius);
      params.set("address", filter.area);
      params.set("quantity", filter.quantity);

      window.location.href = `${modifiedUrl}${params.radius ? "" : params}`;
    } else {
      if (filter.area !== "") {
        console.log("filter.radius");
        const params = new URLSearchParams();
        params.set("radius", filter.radius);
        params.set("address", filter.area);
        if (filter.quantity !== "") {
          params.set("quantity", filter.quantity);
        }
        const queryString = params.toString();
        console.log(queryString);
        navigate(`/home/${queryString}`);
      }
    }
  };

  const pageHandler = (page) => {
    setPage(page);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    let GetAllProductUrl = `${process.env.REACT_APP_API_URI}users/getAllData?page=${page}&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}&userType=${userType}&userId=${data._id}`;

    GetAllProduct(GetAllProductUrl);
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

  const [userData, setUserData] = useState([]);
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
    let GetSharedByUserUrl = `${process.env.REACT_APP_API_URI}users/getAllData/?userType=retailer&latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}&userId=${data._id}`;
    GetSharedByUser(GetSharedByUserUrl);
    const GetUserUrl = `${process.env.REACT_APP_API_URI}users/${
      data._id
    }?userType=${
      data.userType?.toLowerCase() || data?.role[0]?.toLowerCase()
    }}`;
    GetUser(GetUserUrl);
  }, []);
  const GetSharedByUser = async (GetSharedByUserUrl) => {
    try {
      const fetchData = await Axios.get(GetSharedByUserUrl);
      console.log(fetchData.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="all-product-section ">
      <div className="allproduct-mob d-block">
        <div className="container mx-auto">
          <div className="d-flex flex-sm-row flex-column align-items-sm-center justify-content-between gap-4 ps-12 pe-12">
            <div className="d-flex align-items-center gap-4 justify-content-between">
              <h2 className="allproduct-heading ms-12 me-12">All Products</h2>
              <div className="form-control w-max-content h-auto p-0 bg-transparent border-0"></div>
            </div>
            <div className="d-flex mb-4 align-items-center gap-4">
              {userData.userType === "consumer" ? null : (
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  className="green-btn-outline  bg-primary-green ps-3 pt-3 pb-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2 w-max-content"
                >
                  <span className="">
                    Post a{" "}
                    {userData.retailerType === "dispensary"
                      ? "Strain"
                      : userData.retailerType === "headshop"
                      ? "Product"
                      : userData.retailerType === "cannabis"
                      ? "Entry Fee"
                      : userData.retailerType === "growdepot"
                      ? "Accessory"
                      : userData.retailerType === "seedbank" && "Strain"}
                  </span>
                  <span className="icon-green-bg bg-light-green">
                    <AddIcon />
                  </span>
                </button>
              )}
              <div className="d-flex align-items-center w-max-content gap-4"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto ">
        <div className="seeds-card-main row m-0">
          {data?.result?.length !== 0 ? (
            (data || []).result?.map((data, index) => {
              const imageUrl = data.photo
                ? `${process.env.REACT_APP_PORT}/${data.photo[0]}`
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
                            {data.strainName ||
                              data.productName ||
                              data.brandName ||
                              data.accessories ||
                              data.name}
                          </p>

                          {data.userId.retailerType === "dispensary" ? (
                            <>
                              <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                  <DistanceIcon />
                                  <span className="cut-text">
                                    {data.distance} Away
                                  </span>
                                </span>
                                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                  <DispensaryFlower />
                                  <span className="cut-text">
                                    {data.userId.storeName}
                                  </span>
                                </span>
                              </div>

                              <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                <LocationIcon />
                                <span className="cut-text">
                                  {data.userId?.location?.address}
                                </span>
                              </span>
                              {/* <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                <></>
                              </span> */}

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
                            </>
                          ) : (
                            <>
                              {data.userId.retailerType === "headshop" ? (
                                <>
                                  <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                      <PriceIcon />
                                      <span className="cut-text">
                                        Price: {`$${data.cost}`}
                                      </span>
                                    </span>
                                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                      <FlavorIcon />
                                      <span className="cut-text">
                                        Flavour: Mint
                                      </span>
                                    </span>
                                  </div>
                                  {/* <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                      <ConcreteIcon />
                                      <span className="cut-text">%5</span>
                                    </span>
                                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                      <FlavorIcon />
                                      <span className="cut-text">
                                        Flavour: Mint
                                      </span>
                                    </span>
                                  </div> */}
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
                                </>
                              ) : (
                                <>
                                  {data.userId.retailerType === "cannabis" ? (
                                    <>
                                      <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                        <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                          <DistanceIcon />
                                          <span className="cut-text">
                                            {data.distance} Away
                                          </span>
                                        </span>
                                        <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                          <PriceIcon />
                                          <span className="cut-text">
                                            Fees: {`$${data.entryFee}`}
                                          </span>
                                        </span>
                                      </div>
                                      {/* <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-3 pb-sm-1 ">
                                        <TimerIcon />
                                        <span className="cut-text">
                                            Timings: {`${data.userId.startTime} to ${data.userId.closeTime}`}
                                          </span>
                                      </span> */}
                                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                        <LocationIcon />
                                        <span className="cut-text">
                                          {data.userId?.location?.address}
                                          {console.log(data)}
                                        </span>
                                      </span>

                                      <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                        <div className="d-flex gap-2 align-items-center flex-wrap">
                                          <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                            <RatingIcon />
                                            {data.userId.ratingsAverage}
                                          </span>
                                          <span className="font-14-100 text-grey font-weight-400">
                                            ({data.userId.ratingsQuantity}{" "}
                                            Reviews)
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {data.userId.retailerType ===
                                      "seedbank" ? (
                                        <>
                                          <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                              <DistanceIcon />
                                              <span className="cut-text">
                                                {data.distance} Away
                                              </span>
                                            </span>
                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                              <CountIcon />
                                              <span className="cut-text">
                                                {data.quantity} Seeds
                                              </span>
                                            </span>
                                          </div>

                                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                            <LocationIcon />
                                            <span className="cut-text">
                                              {data.userId?.location?.address}
                                            </span>
                                          </span>
                                          {/* <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                      <></>
                                    </span> */}

                                          <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                              <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                                <RatingIcon />
                                                {data.userId.ratingsAverage}
                                              </span>
                                              <span className="font-14-100 text-grey font-weight-400">
                                                ({data.userId.ratingsQuantity}{" "}
                                                Reviews)
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                              <DistanceIcon />
                                              <span className="cut-text">
                                                {data.distance} Away
                                              </span>
                                            </span>
                                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                                              <BudsType />
                                              <span className="cut-text">
                                                Type : {data.productType}
                                              </span>
                                            </span>
                                          </div>

                                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                            <LocationIcon />
                                            <span className="cut-text">
                                              {data.userId?.location?.address}
                                            </span>
                                          </span>
                                          {/* <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                                      <></>
                                    </span> */}

                                          <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                              <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                                <RatingIcon />
                                                {data.userId.ratingsAverage}
                                              </span>
                                              <span className="font-14-100 text-grey font-weight-400">
                                                ({data.userId.ratingsQuantity}{" "}
                                                Reviews)
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}

                          {/* <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                              <DistanceIcon />
                              <span className="cut-text">
                                0 KM Away
                              </span>
                            </span>
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                              {console.log(data)}
                              {data.userId.storeName ? (
                                <DispensaryIcon />
                              ) : (
                                <>{data.cost ? <PriceIcon /> : <PriceIcon />}</>
                              )}

                              <span className="cut-text">
                                {console.log(data)}
                                  {data.userId.storeName}
                              </span>
                            </span>
                          </div> */}
                          {data.timing && (
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500  mb-sm-3 mb-2">
                              <TimerIcon />
                              {data.timing}
                            </span>
                          )}
                          {/* <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2">
                            <LocationIcon />
                            <span className="cut-text">
                              {data.userId?.location?.address}
                              {console.log(data)}
                            </span>
                          </span> */}
                          {/* <div className="d-flex justify-content-between align-items-center gap-sm-2 gap-3 flex-sm-nowrap flex-wrap">
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                              <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                                <RatingIcon />
                                {data.userId.ratingsAverage}
                              </span>
                              <span className="font-14-100 text-grey font-weight-400">
                                ({data.userId.ratingsQuantity} Reviews)
                              </span>
                            </div>
                          </div> */}
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
          {data.totalRecords > 10 && (
            <div className="d-flex justify-content-center mt-4">
              <PaginationControl
                page={page}
                between={3}
                total={data.totalRecords}
                limit={data.limit}
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
            <div className="d-flex justify-content-end">
              <span className="cr-p" data-bs-dismiss="modal">
                <CrossBorderIcon />
              </span>
            </div>
            <form>
              <div className="d-flex flex-column align-items-start justify-content-center mb-5 mt-4 pt-2">
                <p className="font-32 font-weight-800 text-center mb-4">
                  Filter your search
                </p>
                <div className="p-0 bg-transparent border-0 mb-4">
                  <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP}
                    libraries={libraries}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={handlePlaceChanged}
                    >
                      <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
                        <label className=" mb-2 font-weight-600 font-18-100">
                          Search an Area
                        </label>
                        <input
                          type="text"
                          required
                          className="auth-input-filter"
                          placeholder="Enter Address"
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
                <div
                  className={
                    filtertheFilter.includes(Location.pathname)
                      ? "d-none"
                      : "w-100"
                  }
                >
                  <div
                    className="btn-group btn-group-toggle my-4"
                    data-toggle="buttons"
                  >
                    <label className="btn font-14 bg-grey active d-flex align-items-center">
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
                    <label className="btn font-14 bg-grey d-flex align-items-center">
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

                  <div className="form-control h-auto p-0 bg-transparent border-0">
                    <label className="mb-2 font-weight-600 font-18-100">
                      Search by Quantity
                    </label>
                    <select
                      className="auth-input bg-white"
                      required
                      name="quantity"
                      onChange={(e) => formHandler(e)}
                    >
                      <option value={""}>- Search by Quantity -</option>
                      <option value={type === "Seeds" ? "1-4" : "1-7"}>
                        {type === "Seeds" ? "1-5 Seeds" : "1-7 Grams"}
                      </option>
                      <option value={type === "Seeds" ? "5-10" : "7-14"}>
                        {type === "Seeds" ? "5-10 Seeds" : "7-14 Grams"}
                      </option>
                      <option value={type === "Seeds" ? "11-15" : "14-30"}>
                        {type === "Seeds" ? "10-15 Seeds" : "14-30 Grams"}
                      </option>
                      {type === "Seeds" && (
                        <option value={"16-20"}>{"15-20 Seeds"}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center w-100 mt-4">
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
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog custom-model model-lg modal-dialog-centered mx-auto modal-dialog-scrollable">
          <div className="modal-content p-4">
            <div className="d-flex justify-content-end">
              <span className="cr-p" data-bs-dismiss="modal">
                <CrossBorderIcon />
              </span>
            </div>

            {userData.userType === "retailer" && (
              <>
                {userData.retailerType === "dispensary" && (
                  <DispensaryFrom addNewhandler={addNewhandler} />
                )}
                {userData.retailerType === "seedbank" && (
                  <SeedstoreForm addNewhandler={addNewhandler} />
                )}
                {userData.retailerType === "headshop" && (
                  <HeadshopForm addNewhandler={addNewhandler} />
                )}
                {userData.retailerType === "cannabis" && (
                  <CannbisFrom addNewhandler={addNewhandler} />
                )}
                {userData.retailerType === "growdepot" && (
                  <Growndepot addNewhandler={addNewhandler} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsRetailer;
