import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import RejectIcon from "../../assets/Images/rejectIcon";
import ReloadIcon from "../../assets/Images/reloadIcon";
import LikeIconSocial from "../../assets/Images/likeIconSocial";
import PowerIcon from "../../assets/Images/powerIcon";
import SocialFilterIcon from "../../assets/Images/SocialFilter";
import Info from "../../assets/Images/Info";
import LocationIcon from "../../assets/Images/Location";
import CrossBorderIcon from "../../assets/Images/CrossBorder";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardPaymentForm from "./CardPaymentForm";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageDummy from "../../assets/Images/productuser-1.svg";
import FurthurCardPaymentForm from "./FurthurPlansCardPaymentForm ";
import axios from "axios";
import SelectedTick from "../../assets/Images/selectedTick";
import selectAfter from "../../assets/Images/lockedSearch.svg";
import starIcon from "../../assets/Images/starIcon.png";

import MultiRangeSlider from "multi-range-slider-react";
import { CreateChat, createSubscription } from "../../Api";
import { toast } from "react-toastify";
import LikedUsers from "../SocialMatch/LikedUsers";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};
const libraries = ["places"];
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const SocialMatch = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [currentuserData, setcurrentuserData] = useState();
  const inputRef = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState();
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const [type, setType] = useState("");
  const [messagePlanType, setMessagePlanType] = useState("");
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messagesPlans, setMessagesPlans] = useState([]);

  const [filter, setFilter] = useState({
    looking: "",
    age: "",
    address: "",
    userCoords: "",
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting the current location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleLookingChange = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      looking: event.target.value,
    }));
  };

  const childRefs = useMemo(
    () =>
      Array(allUsers?.length)
        .fill(0)
        .map((i) => React.createRef()),
    [allUsers]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const LikeUser = async (userId, likerId, like, direction, index) => {
    const data = {
      userId: userId,
      likerId: likerId,
      like: like.like,
    };
    try {
      const fetchData = await axios.post(
        `${process.env.REACT_APP_API_URI}users/profile-like`,
        data
      );

      setLastDirection(direction);
      updateCurrentIndex(index - 1);
      console.log(fetchData);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const canGoBack = currentIndex < allUsers.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, fullName, index, _id) => {
    console.log("swiped");
    if (direction === "right") {
      LikeUser(_id, currentuserData._id, { like: true }, direction, index);
    } else if (direction === "left") {
      LikeUser(_id, currentuserData._id, { like: false }, direction, index);
    }
  };

  const outOfFrame = (character, index, like) => {
    console.log(
      `${character.fullName} left the screen!`,
      currentIndexRef.current
    );
    currentIndexRef.current >= index && childRefs[index].current.restoreCard();
  };

  const swipe = async (dir) => {
    console.log("swipe");
    if (!canSwipe || currentIndex < 0 || currentIndex >= childRefs.length) {
      console.log("Cannot swipe");
      return;
    }
    await childRefs[currentIndex].current.swipe(dir);
  };

  const UndoUser = async (userId) => {
    const data = {
      userId: userId,
    };
    try {
      const fetchData = await axios.post(
        `${process.env.REACT_APP_API_URI}users/profile-rewind`,
        data
      );
      const newIndex = currentIndex + 1;
      updateCurrentIndex(newIndex);
      await childRefs[newIndex]?.current?.restoreCard();
      console.log(fetchData);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    UndoUser(currentuserData._id);
  };

  // // multirange
  // const handleInput = (e) => {
  //   set_minValue(e.minValue);
  //   set_maxValue(e.maxValue);
  //   setFilter((prevState) => ({
  //     ...prevState,
  //     age: `${e.minValue}-${e.maxValue}`,
  //   }));
  // };
  const resetfilterForm = () => {
    setFilter({
      looking: "",
      age: "",
      address: "",
      sort: "",
      photoOnly: "",
      matchRole: "",
      smoking: "",
      intimate: "",
      socialSetting: "",
      datingLifestyle: "",
    });
    setMinMax({
      minValue: 0,
      maxValue: 0,
    });
    localStorage.removeItem("social-preferences");
    navigate("/social/match");
  };
  // subscription type
  const [subtype, setsuBType] = useState("threemonths");
  const handleSubscription = (event) => {
    setsuBType(event.target.value);
  };

  // cvv
  const [Cvv, setCvv] = useState("");
  const handleCvv = (event) => {
    const limit = 3;
    setCvv(event.target.value.slice(0, limit));
  };

  // exp date
  const [ExpMonth, setExpMonth] = useState("");
  const [ExpYear, setExpYear] = useState("");

  const handleExpiryYear = (event) => {
    const limit = 4;
    setExpYear(event.target.value.slice(0, limit));
    if (event.target.value.length === 4) {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form[index + 1].focus();
      event.preventDefault();
    }
  };
  const handleExpiryMonth = (event) => {
    const limit = 2;
    setExpMonth(event.target.value.slice(0, limit));
    if (event.target.value.length === 2) {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form[index + 1].focus();
      event.preventDefault();
    }
  };

  const [paymentData, setpaymentData] = useState({
    name: "",
    cardnumber: "",
    month: "",
    year: "",
    cvv: "",
    email: "",
  });

  const paymentHandler = (e) => {
    const { name, value } = e.target;
    setpaymentData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const route = "";

  const handleChange = (event, free) => {
    const planIds = substype?.map((obj) => obj.planId);
    const includesMatchingPlanId = planIds?.includes(event.target.value);

    if (!includesMatchingPlanId) {
      if (free) {
        const route = "";

        const data = {
          planId: event.target.value,
          userId: currentuserData._id,
        };
      createSubscription(data, route, navigate, setModalShow, setsubsType);
      } else {
        setModalShow(true);
        setType(event.target.value);
      }
    }
  };
  const handleMessagesPlansChange = (event) => {
    setMessagePlanType(event.target.value);
    setMessageModalShow(true);
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const currentUserPreference = localStorage.getItem("social-preferences");
    let preferenceData = JSON.parse(currentUserPreference);
    const getUsersUrl = `${process.env.REACT_APP_API_URI}users/getUserByfilter${
      preferenceData
        ? `?${
            preferenceData?.hasOwnProperty("looking") &&
            preferenceData.looking !== ""
              ? `&gender=${preferenceData?.looking}`
              : ""
          }${
            preferenceData?.hasOwnProperty("age") && preferenceData.age !== ""
              ? `&age=${preferenceData?.age}`
              : ""
          }${
            preferenceData?.hasOwnProperty("sort") && preferenceData.sort !== ""
              ? `&sort=${preferenceData?.sort}`
              : ""
          }${
            preferenceData?.hasOwnProperty("matchRole") &&
            preferenceData.matchRole !== ""
              ? `&userType=${data?.userType}`
              : ""
          }${
            preferenceData?.hasOwnProperty("photoOnly") &&
            preferenceData.photoOnly !== ""
              ? `&photoOnly=${true}`
              : ""
          }${
            preferenceData?.hasOwnProperty("datingLifestyle") &&
            preferenceData.datingLifestyle !== ""
              ? `&datingLifestyle=${preferenceData?.datingLifestyle}`
              : ""
          }${
            preferenceData?.hasOwnProperty("intimate") &&
            preferenceData.intimate !== ""
              ? `&lookingFor=${preferenceData?.intimate}`
              : ""
          }${
            preferenceData?.hasOwnProperty("socialSetting") &&
            preferenceData.socialSetting !== ""
              ? `&socialSetting=${preferenceData?.socialSetting}`
              : ""
          }${
            preferenceData?.hasOwnProperty("smoking") &&
            preferenceData.smoking !== ""
              ? `&smoking=${preferenceData?.smoking}`
              : ""
          }`
        : ""
    }`;
    GetAllUsers(getUsersUrl);
  }, []);

  const GetAllUsers = async (getUsersUrl) => {
    try {
      const fetchData = await Axios.get(getUsersUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      setAllUsers(fetchData.data);
      updateCurrentIndex(fetchData.data.length - 1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("social-preferences");
    let data = JSON.parse(currentUser);
    setFilter({
      looking: data?.looking,
      age: data?.age,
      address: data?.address,
      sort: data?.sort,
    });
  }, []);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setFilter((prevState) => ({
        ...prevState,
        address: place.formatted_address,
      }));
    }
  };

  const submitFilterHandler = (e) => {
    e.preventDefault();
    const getUsersUrl = `${process.env.REACT_APP_API_URI}users/getUserByfilter${
      filter
        ? `?${
            filter?.hasOwnProperty("looking") && filter.looking !== ""
              ? `&gender=${filter?.looking}`
              : ""
          }${
            filter?.hasOwnProperty("age") && filter.age !== ""
              ? `&age=${filter?.age}`
              : ""
          }${
            filter?.hasOwnProperty("sort") && filter.sort !== ""
              ? `&sort=${filter?.sort}`
              : ""
          }${
            filter?.hasOwnProperty("matchRole") && filter.matchRole !== ""
              ? `&userType=${currentuserData?.userType}`
              : ""
          }${
            filter?.hasOwnProperty("photoOnly") && filter.photoOnly !== ""
              ? `&photoOnly=${true}`
              : ""
          }${
            filter?.hasOwnProperty("datingLifestyle") &&
            filter.datingLifestyle !== ""
              ? `&datingLifestyle=${filter?.datingLifestyle}`
              : ""
          }${
            filter?.hasOwnProperty("intimate") && filter.intimate !== ""
              ? `&lookingFor=${filter?.intimate}`
              : ""
          }${
            filter?.hasOwnProperty("socialSetting") &&
            filter.socialSetting !== ""
              ? `&socialSetting=${filter?.socialSetting}`
              : ""
          }${
            filter?.hasOwnProperty("smoking") && filter.smoking !== ""
              ? `&smoking=${filter?.smoking}`
              : ""
          }`
        : ""
    }`;
    GetAllUsers(getUsersUrl);
    localStorage.setItem("social-preferences", JSON.stringify(filter));
  };

  const [allPlans, setAllPlans] = useState([]);
  const [substype, setsubsType] = useState("");
  const [conversationType, setconversationType] = useState("");

  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentuserData(fetchData?.data?.data?.doc);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    const type = localStorage.getItem("platform");
    setconversationType(type);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
    GetUserSubscription();

    axios
      .get(`${process.env.REACT_APP_API_URI}plan/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setAllPlans(response.data.plans.sort((a, b) => a.price - b.price));
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
    axios
      .get(`${process.env.REACT_APP_API_URI}pricing/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setMessagesPlans(response.data.pricing);
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);

  const createSubscription = (data, route, navigate, setModalShow) => {
    Axios.post(`${process.env.REACT_APP_API_URI}subscription`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    })
      .then(async (response) => {
        toast.success(response?.data?.message);
        setModalShow(false);
        if (route !== "") {
          navigate(route);
        }
        GetUserSubscription();
      })
      .catch((error) => {
        setModalShow(false);
        toast.error(error.response?.data?.message);
        console.log(error);
      });
  };
  const GetUserSubscription = () => {
    Axios.get(
      `${process.env.REACT_APP_API_URI}subscription/user-subscription/${
        JSON.parse(localStorage.getItem("userdata"))._id
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      }
    )
      .then((response) => {
        setsubsType(response.data.userSubscriptions);
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("social-preferences");
    let data = JSON.parse(currentUser);
    setSocialPreference(data);
    setFilter({
      looking: data?.looking,
      age: data?.age,
      address: data?.address,
      sort: data?.sort,
      photoOnly: data?.photoOnly,
      matchRole: data?.matchRole,
      smoking: data?.smoking,
      intimate: data?.intimate,
      socialSetting: data?.socialSetting,
      datingLifestyle: data?.datingLifestyle,
    });
    if (data?.age) {
      const [minAge, maxAge] = data?.age?.split("-").map(Number);
      setMinMax({
        minValue: minAge,
        maxValue: maxAge,
      });
    }
  }, []);

  const [socialPreference, setSocialPreference] = useState("");
  const [minMax, setMinMax] = useState({
    minValue: "",
    maxValue: "",
  });
  const handleInput = (e) => {
    setMinMax({
      minValue: e.minValue,
      maxValue: e.maxValue,
    });
    setFilter((prevState) => ({
      ...prevState,
      age: `${e.minValue}-${e.maxValue}`,
    }));
  };
  const isPremium = currentuserData?.isPremium;
  const divStyle = {
    backgroundImage: `url(${selectAfter})`,
  };

  const Chat = (id) => {
    const currentUser = allUsers?.users[currentIndex];

    CreateChat(
      currentuserData?._id,
      currentUser._id,
      navigate,
      conversationType
    );
  };

  const MatchProfile = (id) => {
    const currentUser = allUsers?.users[currentIndex];
    navigate(`/social/profile/${currentUser?._id}`);
  };

  return (
    <div className="w-100 h-100">
      <div className="cardContainer">
        <div className="py-3 px-4 d-flex justify-content-between align-items-center z-index-1 bg-white">
          <h2
            className="font-24-social font-weight-500 match-filter cr-p btn-style-tinder"
            onClick={() => navigate("/social/profile")}
          >
            <i
              className="fa-regular fa-user text-primary-green d-flex justify-content-center align-items-center"
              style={{ width: "27px", height: "27px" }}
            ></i>
          </h2>
          <div className="d-flex justify-content-around gap-3">
            <img
              src={starIcon}
              alt=""
              style={{ width: "45px", height: "45px" }}
              data-bs-toggle="modal"
              href="#likemodal"
              className="cr-p btn-style-tinder p-1"
            />
            <h2 className="font-24-social cr-p font-weight-500 text-primary-green d-flex justify-content-center align-items-center">
              Smokin’Singles
            </h2>
          </div>
          {!currentuserData?.isPremium ? (
            <OverlayTrigger
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => (
                <Tooltip {...props}>
                  This button is for Premium members. It allows Premium members
                  to rewind the previous profile.
                </Tooltip>
              )}
              placement="left"
            >
              <h2 className="font-24-social font-weight-500 match-filter cr-p btn-style-tinder">
                <i className="fa-regular fa-message text-primary-green d-flex justify-content-center align-items-center"></i>
              </h2>
            </OverlayTrigger>
          ) : (
            <h2
              className="font-24-social font-weight-500 match-filter cr-p btn-style-tinder"
              onClick={() => Chat()}
            >
              <i className="fa-regular fa-message text-primary-green d-flex justify-content-center align-items-center"></i>
            </h2>
          )}
        </div>
        {allUsers.length > 0 ? (
          <>
            {(allUsers || []).users?.map((character, index) => {
              const divStyle = {
                backgroundImage: `url(${process.env.REACT_APP_PORT}/${character.photo})`,
              };
              const imageUrl = character.photo
                ? `${process.env.REACT_APP_PORT}/${character.photo}`
                : "http://localhost:4000/undefined";
              const isPlaceholderImage =
                imageUrl === "http://localhost:4000/undefined";
              return (
                <>
                  <TinderCard
                    ref={childRefs[index]}
                    className="swipe"
                    key={character._id}
                    onSwipe={(dir) =>
                      swiped(dir, character.fullName, index, character._id)
                    }
                    onCardLeftScreen={() =>
                      outOfFrame(character, index, { like: true })
                    }
                  >
                    <div style={divStyle} className="card h-100">
                      {isPlaceholderImage ? (
                        <img
                          className="h-100 w-100 object-fit-cover"
                          src={ImageDummy}
                          alt=""
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_PORT}/${character.photo}`}
                          alt=""
                          className="h-100 w-100 object-fit-cover"
                        />
                      )}
                      {/* <div className="p-4 z-index-1 position-fixed">
                        <p className="font-24-social font-weight-500">
                          Smokin’Singles
                        </p>
                      </div> */}
                      <div className="profile-detail">
                        <div className="d-flex align-items-center gap-3 mb-1">
                          <p className="font-24-social font-weight-500">
                            {character.fullName}
                          </p>
                          <p className="font-weight-600">{character.age}</p>
                        </div>
                        {/* <p>{character?.location?.address}</p> */}
                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <p>
                            Cannabis Consumption (
                            {character.smoking
                              ? character.smoking
                              : "Not Defined"}
                            )
                          </p>
                          {/* <div className="cr-p" onClick={() => MatchProfile()}>
                            <Info />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </TinderCard>
                </>
              );
            })}
            {currentIndex === -1 && (
              <div className="d-flex justify-content-center w-100 mt-5">
                <EmptyDataImage />
              </div>
            )}
          </>
        ) : (
          <div className="d-flex justify-content-center w-100 mt-5">
            <EmptyDataImage />
          </div>
        )}

        <div className="buttons">
          <button
            className={`${!canSwipe ? "notgotback" : ""}`}
            onClick={() => swipe("left")}
          >
            <RejectIcon />
          </button>

          {!currentuserData?.isPremium ? (
            <OverlayTrigger
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => (
                <Tooltip {...props}>
                  This button is for Premium members. It allows Premium members
                  to rewind the previous profile.
                </Tooltip>
              )}
              placement="top"
            >
              <button
                className={`${
                  !canGoBack || !currentuserData?.isPremium ? "notgotback" : ""
                }`}
                onClick={() => goBack()}
              >
                <ReloadIcon />
              </button>
            </OverlayTrigger>
          ) : (
            <button
              disabled={currentuserData?.isPremium ? false : true}
              className={`${
                !canGoBack || !currentuserData?.isPremium ? "notgotback" : ""
              }`}
              onClick={() => goBack()}
            >
              <ReloadIcon />
            </button>
          )}

          <button
            className={`${!canSwipe ? "notgotback" : ""}`}
            onClick={() => swipe("right")}
          >
            <LikeIconSocial />
          </button>

          <button data-bs-toggle="modal" href="#boostmodal">
            <PowerIcon />
          </button>

          <button data-bs-toggle="modal" href="#exampleModalToggle">
            <span className="match-filter">
              <SocialFilterIcon />
            </span>
          </button>
          <span className="cr-p" onClick={() => MatchProfile()}>
            <Info />
          </span>
        </div>
      </div>

      {/*filter  modal */}
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header px-4">
              <button
                type="button"
                className="green-btn-outline text-primary-green w-max-content px-3"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Back
              </button>
              <h1
                className="modal-title fs-5 text-center"
                id="exampleModalToggleLabel"
              >
                Set Filter
              </h1>
              <button
                type="button"
                className="green-btn-outline text-primary-green w-max-content px-3 mb-3"
                onClick={() => resetfilterForm()}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Clear
              </button>
            </div>
            <div className="modal-body px-4 pt-3">
              <form
                onSubmit={(e) => submitFilterHandler(e)}
                className=" text-white bg-filter filter-for"
              >
                <div className="self-summary-filter rounded-1">
                  <div className="form-control h-auto bg-transparent font-16-social line-height-20px text-white border-0 w-100 px-0 mb-3">
                    <label className="font-weight-600 font-18-100 mb-2 d-flex justify-content-between w-100">
                      <span className="text-dark">Age Range</span>
                      <span className="text-dark">
                        {minMax.minValue} {minMax.maxValue}
                      </span>
                    </label>
                    <MultiRangeSlider
                      className="shadow-none border-0 py-0 px-2 py-2"
                      min={18}
                      max={70}
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
                  <div className="form-control h-auto p-0 bg-transparent border-0 ">
                    <select
                      className="auth-input-filter mb-3 rounded-3 height-56"
                      name="looking"
                      onChange={(e) => formHandler(e)}
                      value={filter.looking}
                    >
                      <option value="">I am Looking For</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Other</option>
                    </select>
                  </div>
                  {/* <div className="form-control h-auto p-0 bg-transparent border-0 ">
            <select
              className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
              name="age"
              onChange={(e) => formHandler(e)}
              value={filter.age}
            >
              <option value="">Age range</option>
              <option value="0-20">Under 20</option>
              <option value="0-30">Under 30</option>
              <option value="0-40">Under 40</option>
              <option value="0-50">Under 50</option>
            </select>
          </div> */}
                  <div className="form-control h-auto p-0 bg-transparent border-0 ">
                    <select
                      className="auth-input-filter mb-3 rounded-3 height-56"
                      name="smoking"
                      onChange={(e) => formHandler(e)}
                      value={filter.smoking}
                    >
                      <option value="">Smoking Routine</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="form-control h-auto p-0 bg-transparent border-0 ">
                    <select
                      className="auth-input-filter mb-3 rounded-3 height-56"
                      name="socialSetting"
                      onChange={(e) => formHandler(e)}
                      value={filter.socialSetting}
                    >
                      <option value="">
                        What is your preferred Social setting?
                      </option>
                      <option value="introvert">Introvert</option>
                      <option value="extrovert">Extrovert</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  {/* <div className="form-control h-auto p-0 bg-transparent border-0 ">
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP}
              libraries={libraries}
            >
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
              >
                <input
                  onChange={(e) =>
                    setFilter((prevState) => ({
                      ...prevState,
                      address: e.target.value,
                    }))
                  }
                  value={filter.address}
                  type="text"
                  className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
                  placeholder="Enter Address"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </StandaloneSearchBox>
            </LoadScript>
          </div> */}
                  {isPremium && (
                    <div className="self-summary-filter rounded-0 border-0">
                      <div className="form-control h-auto p-0 bg-transparent border-0 ">
                        <select
                          className="auth-input-filter mb-3 rounded-3 height-56"
                          name="datingLifestyle"
                          onChange={(e) => formHandler(e)}
                          value={filter.datingLifestyle}
                          disabled={!currentuserData?.isPremium}
                        >
                          <option value="">Dating lifestyle</option>
                          <option value="kink">Kink</option>
                          <option value="traditional">Traditional</option>
                        </select>
                      </div>
                      <div
                        className="btn-groups btn-group-toggle flex-column w-100"
                        data-toggle="buttons-1"
                      >
                        {/* <label
                          className={`btn subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100  ${
                            socialPreference?.matchRole ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="matchRole"
                            id="matchRole"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.matchRole === "matchRole"}
                          />
                          <div
                            className={`py-3 font-16-social mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-400 `}
                          >
                            My match’s role
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label>
                        <label
                          className={`btn subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100  ${
                            socialPreference?.photoOnly ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="photoOnly"
                            id="photoOnly"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.photoOnly === "photoOnly"}
                          />
                          <div className="py-3 font-16-social mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-400">
                            Photo only
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label> */}
                        <label
                          className={`btn height-56 subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100  ${
                            socialPreference?.intimate ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="intimate"
                            id="intimate"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.intimate === "intimate"}
                          />
                          <div className="py-3 font-16-social mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-400">
                            Intimate Encounters
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="font-16-social font-weight-700 text-dark px-0 mt-4 pt-2 mb-3">
                  SORT BY
                </h3>
                <div className="self-summary-filter border-0 rounded-0">
                  <div
                    className="btn-groups btn-group-toggle flex-column w-100"
                    data-toggle="buttons"
                  >
                    <label className="btn height-56 subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100 ">
                      <input
                        type="radio"
                        name="sort"
                        id="lastonline"
                        autoComplete="off"
                        readOnly
                        checked={filter.sort === "lastOnline"}
                        onChange={(e) => formHandler(e)}
                        value={"lastOnline"}
                      />
                      <div className="py-3 font-14-100 h-100 px-4 border-0 rounded-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500">
                        LAST ONLINE
                        <SelectedTick />
                      </div>
                    </label>
                    <label className="btn height-56 subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100 ">
                      <input
                        type="radio"
                        name="sort"
                        id="Grams"
                        autoComplete="off"
                        readOnly
                        checked={filter.sort === "newest"}
                        onChange={(e) => formHandler(e)}
                        value={"newest"}
                      />
                      <div className="py-3 font-14-100 h-100 px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500">
                        NEWEST
                        <SelectedTick />
                      </div>
                    </label>
                  </div>
                </div>
                {isPremium ? null : (
                  <>
                    <p className="font-18 font-weight-500 text-white text-center pt-2">
                      Advance filters (Premium members only)
                    </p>
                    <div className="d-flex flex-sm-row flex-column align-items-center gap-2 justify-content-center mx-5 mt- pt-3">
                      <button
                        onClick={() => navigate("/social/subscription")}
                        className="green-btn mb-4 px-5"
                        type="button"
                      >
                        Upgrade Now
                      </button>
                    </div>
                    <div className="self-summary-filter rounded-0 border-0">
                      <div
                        className="btn-group btn-group-toggle flex-column w-100"
                        data-toggle="buttons-1"
                      >
                        {/* <label
                          className={`btn subscription-offer rounded-0 border-0 p-0 w-100 auth-input font-14-100 border-0 w-100  ${
                            socialPreference?.matchRole ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="matchRole"
                            id="matchRole"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.matchRole === "matchRole"}
                          />
                          <div
                            className={`py-3 font-14 mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500`}
                          >
                            My match’s role
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label>
                        <label
                          className={`btn subscription-offer rounded-0 p-0 w-100 auth-input font-14-100 border-0 w-100 border-bottom rounded-0 border-06 ${
                            socialPreference?.photoOnly ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="photoOnly"
                            id="photoOnly"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.photoOnly === "photoOnly"}
                          />
                          <div className="py-3 font-14 mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500">
                            Photo only
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label> */}
                        <label
                          className={`btn height-56 subscription-offers d-flex rounded-3 mb-3 p-0 w-100 auth-inputs font-16-social border-0 w-100 ${
                            socialPreference?.intimate ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="intimate"
                            className=""
                            id="intimate"
                            readOnly
                            disabled={!currentuserData?.isPremium}
                            onChange={(e) => formHandler(e)}
                            checked={filter.intimate === "intimate"}
                          />
                          <div className="py-3  font-14 mb  px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500">
                            Intimate Encounters
                            {!currentuserData?.isPremium ? (
                              <svg
                                className="d-block"
                                width={12}
                                height={15}
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_4_585)">
                                  <path
                                    opacity="0.3"
                                    d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                                    fill="#5D8B2F"
                                  />
                                  <path
                                    d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                                    fill="#5D8B2F"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_4_585">
                                    <rect width={12} height={15} fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <SelectedTick />
                            )}
                          </div>
                        </label>
                      </div>
                      <div className="form-control h-auto p-0 bg-transparent border-0">
                        <select
                          style={divStyle}
                          className="auth-input-filter mb-3 rounded-3 height-56"
                          name="looking"
                          onChange={(e) => formHandler(e)}
                          value={filter.looking}
                          // disabled={!currentuserData?.isPremium}
                        >
                          <option value="">Dating lifestyle</option>
                          <option value="kink">Kink</option>
                          <option value="traditional">Traditional</option>
                        </select>
                        {/* {!currentuserData?.isPremium ? (
                  <svg
                    className="d-block"
                    width={12}
                    height={15}
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_4_585)">
                      <path
                        opacity="0.3"
                        d="M1.5 13.5716H10.5V6.42871H1.5V13.5716ZM6 8.57157C6.825 8.57157 7.5 9.21443 7.5 10.0001C7.5 10.7859 6.825 11.4287 6 11.4287C5.175 11.4287 4.5 10.7859 4.5 10.0001C4.5 9.21443 5.175 8.57157 6 8.57157Z"
                        fill="#5D8B2F"
                      />
                      <path
                        d="M10.5 5H9.75V3.57143C9.75 1.6 8.07 0 6 0C3.93 0 2.25 1.6 2.25 3.57143V5H1.5C0.675 5 0 5.64286 0 6.42857V13.5714C0 14.3571 0.675 15 1.5 15H10.5C11.325 15 12 14.3571 12 13.5714V6.42857C12 5.64286 11.325 5 10.5 5ZM3.75 3.57143C3.75 2.38571 4.755 1.42857 6 1.42857C7.245 1.42857 8.25 2.38571 8.25 3.57143V5H3.75V3.57143ZM10.5 13.5714H1.5V6.42857H10.5V13.5714ZM6 11.4286C6.825 11.4286 7.5 10.7857 7.5 10C7.5 9.21429 6.825 8.57143 6 8.57143C5.175 8.57143 4.5 9.21429 4.5 10C4.5 10.7857 5.175 11.4286 6 11.4286Z"
                        fill="#5D8B2F"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4_585">
                        <rect width={12} height={15} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                ) : null} */}
                      </div>
                    </div>
                  </>
                )}

                <div className="d-flex align-items-center gap-4 justify-content-center mx-5 mt-4 pt-3">
                  {/* <button
                    type="button"
                    className="green-btn-outline text-primary-green w-max-content px-3 mb-3"
                    onClick={() => resetfilterForm()}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Clear
                  </button> */}
                  <button
                    className="green-btn px-5 mb-3"
                    type="submit"
                    data-bs-target="#boostmodal"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* boost modal */}
      <div
        className="modal fade"
        id="boostmodal"
        aria-hidden="true"
        aria-labelledby="boostmodalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header px-4 justify-content-start">
              <button
                type="button"
                className="outline-0 border-0 bg-transparent"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CrossBorderIcon />
              </button>
            </div>
            <div className="modal-body px-4 mb-3">
              <form
                onSubmit={(e) => e.preventDefault()}
                className=" d-flex flex-column justify-content-between h-100"
              >
                <div>
                  <h4 className="">Select a Plan</h4>
                  <div
                    className="btn-group btn-group-toggle my-4 flex-column gap-4 w-100"
                    data-toggle="buttons"
                  >
                    <Slider {...settings} className="">
                      {allPlans.length > 0 &&
                        allPlans.map((plan, index) => {
                          const planIds = (substype || [])?.map(
                            (obj) => obj.planId
                          );
                          if (
                            plan.type === "social" ||
                            plan.type === "combine"
                          ) {
                            return (
                              <label
                                key={index}
                                className={`shadow-none border-0 btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center  ${
                                  planIds.includes(plan._id) &&
                                  "active highlight"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="options"
                                  id={plan._id}
                                  autoComplete="off"
                                  readOnly
                                  checked={
                                    type === plan._id ||
                                    plan._id === substype?.planId
                                  }
                                  onClick={(e) => handleChange(e, plan.free)}
                                  value={plan._id}
                                />
                                <div
                                  className={`subs p-4 w-100 d-flex justify-content-center align-items-center text-dark-black  ${
                                    plan._id === substype?.planId
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <p className="font-32-social font-weight-700 border-bottom border-grey pb-3 text-capitalize">
                                    {`$${plan.price}${
                                      plan?.interval
                                        ? ` / ${plan?.interval}`
                                        : ""
                                    }`}
                                  </p>
                                  <div className="px-3 pt-3">
                                    <p className="font-18-social font-weight-700">
                                      {plan.name}
                                    </p>
                                    {/* <p className="font-16-social font-weight-400">
                                      {`SAVE ${plan.discount}`}
                                    </p> */}
                                  </div>
                                </div>
                              </label>
                            );
                          }
                        })}
                    </Slider>
                  </div>
                  {/* <div className="mt-4">
                    <h4 className="">Additional Profile Plan</h4>
                    <div
                      className="btn-group btn-group-toggle my-4 flex-column gap-4 w-100"
                      data-toggle="buttons"
                    >
                      <Slider {...settings} className="">
                        {messagesPlans?.length > 0 &&
                          messagesPlans?.map((plan, index) => {
                            return (
                              <label
                                key={index}
                                className={`shadow-none border-0 btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center  ${
                                  plan._id === substype?.planId ? "active" : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="options"
                                  id={plan._id}
                                  autoComplete="off"
                                  readOnly
                                  checked={
                                    type === plan._id ||
                                    plan._id === substype?.planId
                                  }
                                  onChange={handleMessagesPlansChange}
                                  value={plan._id}
                                />
                                <div
                                  className={`subs p-4 w-100 d-flex justify-content-center align-items-center text-dark-black  ${
                                    plan._id === substype?.planId
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <p className="font-32-social font-weight-700 border-bottom border-grey pb-3">
                                    {`$${plan.price}`}
                                  </p>
                                  <div className="px-3 pt-3">
                                    <p className="font-18-social font-weight-700">
                                      {plan.details}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                      </Slider>
                    </div>
                  </div> */}

                  <div className="subsciption-benifits">
                    <ul>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Unlimited Likes
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          See Who Likes You
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Unlimited Rewind
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Hide Advertisements
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Control Your Profile
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Control Who You See
                        </h4>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Passport
                        </h4>
                        <p className="font-14-100 mt-1">
                          Match and chat with poeple anywhere in the world
                        </p>
                      </li>
                      <li>
                        <h4 className="font-16-social font-weight-600">
                          Interest Indicators
                        </h4>
                        <p className="font-14-100 mt-1">
                          Premium members get Interest Indicators (which
                          notifies members immediately they’ve been super liked)
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* <button
                  className="green-btn mt-3 py-3 h-auto green-gradient d-flex justify-content-center align-items-center"
                  data-bs-target="#paymentmodal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Continue
                </button> */}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* payment modal */}
      <div
        className="modal fade"
        id="paymentmodal"
        aria-hidden="true"
        aria-labelledby="paymentmodalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header px-4 justify-content-between">
              <button
                type="button"
                className="outline-0 border-0 bg-transparent"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CrossBorderIcon />
              </button>
              <button
                className="green-btn-outline w-max-content px-3 text-primary-green"
                data-bs-target="#boostmodal"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                Back
              </button>
            </div>
            <div className="modal-body px-4 mb-3">
              <form
                onSubmit={(e) => e.preventDefault()}
                className=" d-flex flex-column justify-content-between h-100"
              >
                <div>
                  <h4 className="mb-3">Payment Method</h4>

                  <div className="auth-input h-auto bg-transparent bg-white text-dark mb-3">
                    {subtype === "sixmonths" ? (
                      <>
                        <div className="d-flex flex-column">
                          <div className="d-flex justify-content-between gap-3 align-items-center border-bottom border-grey pb-3">
                            <span>Subscription Type</span>
                            <h4>6 Months</h4>
                          </div>
                          <div className="d-flex justify-content-between gap-3 align-items-center pt-3">
                            <span>Total</span>
                            <h4>$70.99</h4>
                          </div>
                        </div>
                      </>
                    ) : subtype === "threemonths" ? (
                      <>
                        <div className="d-flex flex-column">
                          <div className="d-flex justify-content-between gap-3 align-items-center border-bottom border-grey pb-3">
                            <span>Subscription Type</span>
                            <h4>3 Months</h4>
                          </div>
                          <div className="d-flex justify-content-between gap-3 align-items-center pt-3">
                            <span>Total</span>
                            <h4>$45.00</h4>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex flex-column">
                          <div className="d-flex justify-content-between gap-3 align-items-center border-bottom border-grey pb-3">
                            <span>Subscription Type</span>
                            <h4>1 Month</h4>
                          </div>
                          <div className="d-flex justify-content-between gap-3 align-items-center pt-3">
                            <span>Total</span>
                            <h4>$18.99</h4>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-control h-auto border-0 p-0 mb-3">
                    <label className="mb-1 font-16 font-weight-600">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Tony"
                      required
                      className="auth-input h-auto bg-transparent bg-white text-dark"
                      name="name"
                      value={paymentData.name}
                      onChange={paymentHandler}
                      onKeyDown={(e) => handleEnter(e)}
                    />
                  </div>
                  <div className="form-control h-auto border-0 p-0 mb-3">
                    <label
                      className="font-16 font-weight-600 pb-1"
                      htmlFor="name"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="8764 2300 9890 4328"
                      className="auth-input h-auto bg-transparent bg-white text-dark"
                      name="cardnumber"
                      value={cc_format(paymentData.cardnumber)}
                      onChange={paymentHandler}
                      onKeyDown={(e) => handleEnter(e)}
                    />
                  </div>
                  <div className="row mx-0 mb-3">
                    <div className="col-12 p-0 d-flex gap-3 justify-content-between align-items-center">
                      <div className="d-flex flex-column">
                        <label
                          className="font-16 font-weight-600 pb-1"
                          htmlFor="name"
                        >
                          Expiry Date
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            required
                            placeholder="MM"
                            className="auth-input bg-transparent h-auto bg-white text-dark"
                            name="month"
                            value={ExpMonth}
                            onChange={handleExpiryMonth}
                            onKeyDown={(e) => handleEnter(e)}
                          />
                          <p className="px-3">/</p>
                          <input
                            type="number"
                            required
                            maxLength={4}
                            placeholder="YYYY"
                            className="auth-input bg-transparent h-auto bg-white text-dark"
                            name="year"
                            value={ExpYear}
                            onChange={handleExpiryYear}
                            onKeyDown={(e) => handleEnter(e)}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-column mb-32 w-118px">
                        <label
                          className="font-16 font-weight-600 pb-1"
                          htmlFor="email"
                        >
                          CVV
                        </label>
                        <input
                          type="password"
                          required
                          className="auth-input bg-transparent h-auto bg-white text-dark"
                          name="cvv"
                          value={Cvv}
                          onChange={handleCvv}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-control h-auto border-0 p-0 mb-4">
                    <label className="mb-1 font-16 font-weight-600">
                      Email Address
                    </label>
                    <input
                      required
                      placeholder="abc@email.com"
                      name="email"
                      type="email"
                      className="auth-input h-auto bg-transparent bg-white text-dark"
                      onChange={paymentHandler}
                      onKeyDown={(e) => handleEnter(e)}
                    />
                  </div>
                </div>

                <button className="green-btn mt-3 py-3 h-auto green-gradient d-flex justify-content-center align-items-center">
                  Buy Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Its a match */}
      <div
        className="modal fade"
        id="matchmodal"
        aria-hidden="true"
        aria-labelledby="matchmodalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-body bg-dark-black px-4 mb-3">
              <form
                onSubmit={(e) => e.preventDefault()}
                className=" d-flex flex-column justify-content-center gap-5 h-100 align-items-center"
              >
                <div className="text-center">
                  <h4 className="font-72 text-primary-green mb-3">
                    Its a Match!
                  </h4>
                  <p className="font-16-social text-white">
                    You and other user liked each other
                  </p>
                </div>
                <div className="d-flex flex-column gap-3 w-100">
                  <button
                    onClick={() => navigate("/chat")}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className="green-btn text-white d-flex justify-content-center align-items-center"
                  >
                    See Message
                  </button>
                  <button
                    className="green-btn-outline text-primary-green"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Keep Scrolling
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Liked a Users */}
      <div
        className="modal fade"
        id="likemodal"
        aria-hidden="true"
        aria-labelledby="likemodalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header px-4 justify-content-start">
              <button
                type="button"
                className="outline-0 border-0 bg-transparent"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CrossBorderIcon />
              </button>
            </div>
            <div className="modal-body px-4">
              <LikedUsers currentIndex={currentIndex} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        show={modalShow}
        onHide={() => setModalShow(false)}
        className="rounded-10"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="font-weight-bold"
          >
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <CardPaymentForm
              type={type}
              setModalShow={setModalShow}
              route={route}
              setsubsType={setsubsType}
            />
          </Elements>
        </Modal.Body>
        <Modal.Footer className="border-0 mt-3">
          <Button
            onClick={() => setModalShow(false)}
            className="green-btn-outline text-primary-green w-max-content px-3"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        show={messageModalShow}
        onHide={() => setMessageModalShow(false)}
        className="rounded-10"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="font-weight-bold"
          >
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <FurthurCardPaymentForm
              type={messagePlanType}
              setModalShow={setMessageModalShow}
              route={route}
            />
          </Elements>
        </Modal.Body>
        <Modal.Footer className="border-0 mt-3">
          <Button
            onClick={() => setMessageModalShow(false)}
            className="green-btn-outline text-primary-green w-max-content px-3"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SocialMatch;

function handleEnter(event) {
  if (event.key === "Enter") {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    form[index + 1].focus();
    event.preventDefault();
  }
}
function cc_format(value) {
  const v = value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .substr(0, 16);
  const parts = [];

  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }

  return parts.length > 1 ? parts.join(" ") : value;
}
