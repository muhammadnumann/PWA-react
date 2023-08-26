import React from "react";
import DistanceIcon from "../../assets/Images/Distance";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import DispensryProductIcon from "../../assets/Images/Dispensry1";
import MobHeartIcon from "../../assets/Images/MobHeart";
import TimerIcon from "../../assets/Images/Timer";
import PriceIcon from "../../assets/Images/Price";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import ImageDummy from "../../assets/Images/match/dummy.png";
import { CreateChat } from "../../Api";
import EmptyDataImage from "../../assets/Images/EmptyData";
import SendMailIcon from "../../assets/Images/SendMail";
import axios from "axios";

const CannabisProfileDetail = () => {
  const routeParams = useParams();
  const [cannabis, setCannabis] = useState([]);
  const [others, setOthers] = useState([]);
  const [conversationType, setconversationType] = useState("");
  const [currentuserData, setcurrentuserData] = useState();
  const [chatData, setChatData] = useState({
    senderId: "",
    receiverId: "",
  });
  const [filter, setFilter] = useState({
    event: "",
    foodOfferd: "",
    brandName: "",
  });
  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const GetCannabiss = async (GetCannabissUrl) => {
    try {
      const fetchData = await Axios.get(GetCannabissUrl);
      setCannabis(fetchData.data.data);
      console.log(fetchData.data.data);
      let GetOthersUrl = `${process.env.REACT_APP_API_URI}cannabisLounge/userCannabisLounge/?userId=${fetchData.data.data.userId?._id}`;
      GetOthersByUser(GetOthersUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const GetOthersByUser = async (GetOthersUrl) => {
    try {
      const fetchData = await Axios.get(GetOthersUrl);
      setOthers(fetchData.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  useEffect(() => {
    const type = localStorage.getItem("platform");
    setconversationType(type);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetCannabissUrl = `${process.env.REACT_APP_API_URI}cannabisLounge/${routeParams.id}?latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    GetCannabiss(GetCannabissUrl);
    setChatData((prevState) => ({
      ...prevState,
      senderId: data._id,
    }));
  }, [routeParams.id]);

  const favouriteHandler = (userId, prodId, categry) => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const markdata = {
      userId: userId,
      pId: prodId,
      category: categry,
      latlang: `${data.location.coordinates[0]},${data.location.coordinates[1]}`,
    };
    axios
      .post(`${process.env.REACT_APP_API_URI}users/markFavourite`, markdata)
      .then((response) => {
        const currentUser = localStorage.getItem("userdata");
        let data = JSON.parse(currentUser);
        let GetCannabissUrl = `${process.env.REACT_APP_API_URI}cannabisLounge/${routeParams.id}?latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
        GetCannabiss(GetCannabissUrl);
        toast.success(response.data.messgae);
      })
      .catch((error) => {
        toast.error(error?.response.data.message);
        console.log(error);
      });
  };

  const navigate = useNavigate();
  return (
    <div className="product-user-profile">
      <div className="container mx-auto">
        <div className="d-sm-flex d-none align-items-center gap-2 font-18-100 font-weight-500 mb-4 ps-12">
          <Link to={"/home"} className="text-primary-green cr-p">
            Home
          </Link>
          &gt;
          <span
            className="text-primary-green cr-p"
            onClick={() => navigate(-1)}
          >
            Cannabis Lounge
          </span>
          &gt;
          <span className="text-grey">{cannabis.event}</span>
        </div>
        <div className="row m-0 flex-row seed-card product-profile ">
          <div className="col-lg-5 ps-0">
            {cannabis?.photo ? (
              <img
                className="w-100"
                src={`${process.env.REACT_APP_PORT}/${cannabis.photo}`}
                alt=""
              />
            ) : (
              <img className="w-100" src={ImageDummy} alt="Dummy IMG" />
            )}
          </div>
          <div className="col-lg-7 pe-0 ps-lg-3 ps-0 pt-lg-0 pt-5">
            <div className="ps-sm-0 ps-3">
              <div className="border-smx-bottom mb-4">
                <p className="mb-3 pb-3 font-32 font-weight-900">
                  {cannabis.brandName || cannabis.accessories}
                </p>
                <div className="d-flex gap-xxl-5 gap-lg-4 gap-sm-4 gap-3 align-items-sm-end gap-2 mb-sm-4 mb-3 flex-sm-row flex-column flex-wrap">
                  <div>
                    <span className="d-flex gap-2 align-items-center font-18 mb-sm-4 mb-3 font-weight-500">
                      <DispensryProductIcon />
                      <span>{cannabis.event}</span>
                    </span>
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                      <DistanceIcon />
                      <span>{cannabis.distance}</span>
                    </span>
                  </div>
                  <div>
                    <div className="d-flex gap-2 align-items-center flex-wrap mb-sm-4 mb-3">
                      <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                        <RatingIcon />
                        <span>{cannabis?.userId?.ratingsAverage}</span>
                      </span>
                      <span className="font-18-100 text-grey font-weight-400">
                        <span>
                          ({cannabis?.userId?.ratingsQuantity} Reviews)
                        </span>
                      </span>
                    </div>
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                      <PriceIcon />
                      <span>Entry Fees: ${cannabis.entryFee}</span>
                    </span>
                  </div>
                  <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                    <TimerIcon />
                    <span>{`Store Hours: ${cannabis?.userId?.startTime} To ${cannabis?.userId?.closeTime}`}</span>
                  </span>
                </div>

                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-3">
                  <LocationIcon />
                  <span>{cannabis.userId?.location?.address}</span>
                </span>
              </div>
              <p className="font-24 font-weight-700">
                {cannabis.ConnectToEventbrite}
              </p>
              <p className="mt-3 font-18 font-weight-500">
                {cannabis.ConnectToEventbrite}
              </p>

              <div className="d-flex flex-sm-row flex-column justify-content-between align-items-center gap-4 mt-5 pt-4">
                <button
                  onClick={() =>
                    favouriteHandler(
                      currentuserData._id,
                      cannabis._id,
                      cannabis.category
                    )
                  }
                  className="green-btn-outline text-primary-green ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2"
                >
                  <span>
                    {cannabis.favourite &&
                    cannabis.favourite.includes(currentuserData._id)
                      ? "Mark Unfavourite"
                      : "Mark Favourite"}
                  </span>
                  <span className="icon-green-bg">
                    {cannabis.favourite &&
                    cannabis.favourite.includes(currentuserData._id) ? (
                      <svg
                        width={20}
                        height={18}
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.62 17.909C10.28 18.0303 9.72 18.0303 9.38 17.909C6.48 16.9079 0 12.7315 0 5.65281C0 2.52809 2.49 0 5.56 0C7.38 0 8.99 0.889888 10 2.26517C11.01 0.889888 12.63 0 14.44 0C17.51 0 20 2.52809 20 5.65281C20 12.7315 13.52 16.9079 10.62 17.909Z"
                          fill="#BE3F3F"
                        />
                      </svg>
                    ) : (
                      <MobHeartIcon />
                    )}
                  </span>
                </button>
                <div
                  onClick={() =>
                    CreateChat(
                      chatData.senderId,
                      cannabis.userId._id,
                      navigate,
                      conversationType
                    )
                  }
                  className="cr-p green-btn text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-sm-2 gap-2"
                >
                  <span>Message </span>
                  <span className="send-message w-max-content">
                    <SendMailIcon />
                  </span>
                </div>
                {cannabis?.userId?.location?.phone && (
                  <a
                    href={`tel:${cannabis?.userId?.location?.phone}`}
                    className="call-store w-100"
                  >
                    <div className="green-btn text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-sm-2 gap-2">
                      <span>Call Store </span>
                      <span className="send-message w-max-content">
                        <SendMailIcon />
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <h3 className="d-flex gap-2 align-items-center flex-wrap font-32 font-weight-700 pt-3 mt-5 ms-12 bordered-heading">
          What We Offer At:
          <span className="text-primary-green"> {cannabis.event}</span>
        </h3>

        <div className="row m-0 pt-4">
          <div className="col-lg-4 col-md-6  bg-transparent border-0 mb-3">
            <label className="mb-2 font-weight-700 font-18-100">
              Accessories For Use
            </label>
            <select
              className="auth-input height-56 bg-white"
              name="brandName"
              onChange={(e) => {
                formHandler(e);
                GetOthersByUser(
                  `${
                    process.env.REACT_APP_API_URI
                  }cannabisLounge/userCannabisLounge/?userId=${
                    cannabis.userId?._id
                  }&${`&brandName=${e.target.value}`}`
                );
              }}
            >
              <option value="">- Select Option -</option>
              <option value="Bongs">Bongs</option>
              <option value="Rig">Rig</option>
              <option value="Papers">Papers</option>
              <option value="Vaporizers">Vaporizers</option>
            </select>
          </div>
          <div className="col-lg-4 col-md-6  bg-transparent border-0 mb-3">
            <label className="mb-2 font-weight-700 font-18-100">Events</label>
            <select
              className="auth-input height-56 bg-white"
              name="event"
              onChange={(e) => {
                formHandler(e);
                GetOthersByUser(
                  `${
                    process.env.REACT_APP_API_URI
                  }cannabisLounge/userCannabisLounge/?userId=${
                    cannabis.userId?._id
                  }&${`event=${e.target.value}`}${`&brandName=${filter.brandName}`}`
                );
              }}
            >
              <option value="">- Select Option -</option>
              <option value="Music/Band">Music / Band</option>
              <option value="ComedyShow">Comedy Show</option>
              <option value="SeshandPaint">Sesh and Paint</option>
              <option value="BBQ">BBQ</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-lg-4 col-md-6  bg-transparent border-0">
            <label className="mb-2 font-weight-700 font-18-100"> Food</label>
            <select
              className="auth-input height-56 bg-white"
              name="foodOfferd"
              onChange={(e) => {
                formHandler(e);
                GetOthersByUser(
                  `${
                    process.env.REACT_APP_API_URI
                  }cannabisLounge/userCannabisLounge/?userId=${
                    cannabis.userId?._id
                  }&${`foodOfferd=${e.target.value}`}${`&event=${filter.event}`}${`&brandName=${filter.brandName}`}`
                );
              }}
            >
              <option value="">- Select Option -</option>
              <option value="Shakes">Shakes</option>
              <option value="HotDogs/Burgers">HotDogs/Burgers</option>
              <option value="SoftDrinks">Soft Drinks</option>
              <option value="Nachos">Nachos</option>
              <option value="Edibles">Edibles</option>
            </select>
          </div>
        </div>

        <div className="seeds-card-main row m-0 pt-5">
          {others?.length !== 0 ? (
            (others || [])?.map((data, index) => {
              const imageUrl = data.photo
                ? `${process.env.REACT_APP_PORT}/${data.photo}`
                : "http://localhost:4000/undefined";
              const isPlaceholderImage =
                imageUrl === "http://localhost:4000/undefined";

              return (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 mb-4 seed-card-col"
                  key={index}
                >
                  <Link
                    to={`/home/cannabisLounge/${data._id}`}
                    className="seed-card position-relative text-black"
                  >
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
                            {data.brandName ||
                              data.accessories ||
                              data.productName}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 gap-sm-3 gap-2">
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                              <DispensryProductIcon />
                              <span className="cut-text">
                                {cannabis?.event} Away
                              </span>
                            </span>

                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 w-50">
                              <PriceIcon />
                              <span className="cut-text">
                                Entry Fees: ${cannabis.entryFee}
                              </span>
                            </span>
                          </div>
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2 ">
                            <LocationIcon />
                            <span className="cut-text">
                              {data.userId?.location?.address}
                            </span>
                          </span>
                        </div>
                        {/* <p className="mt-3 font-18 font-weight-500 ps-sm-0 ps-3">
                          {data.description}
                        </p> */}
                      </div>
                    </div>
                  </Link>
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

export default CannabisProfileDetail;
