import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectedTick from "../../assets/Images/selectedTick";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import selectAfter from "../../assets/Images/lockedSearch.svg";
import MultiRangeSlider from "multi-range-slider-react";

const LookingFor = () => {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [currentuserData, setcurrentuserData] = useState();
  const [socialPreference, setSocialPreference] = useState("");
  const [filter, setFilter] = useState({
    looking: "",
    age: "",
    radius: "",
    //address: "",
    sort: "",
    photoOnly: "",
    matchRole: "",
    smoking: "",
    intimate: "",
    socialSetting: "",
    datingLifestyle: "",
  });

  //const [radiusFilter, setRadiusFilter] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data); 
    
    console.log(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
  }, []);

  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentuserData(fetchData?.data?.data?.doc);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("social-preferences");
    let data = JSON.parse(currentUser);
    setSocialPreference(data);
    setFilter({
      looking: data?.looking,
      age: data?.age,
      radius: data?.radius,
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

  const formHandler = (e) => {
    const { name, value } = e.target;
    if (name === "matchRole" || name === "photoOnly" || name === "intimate") {
      if (e.target.checked) {
        setFilter((prevState) => ({
          ...prevState,
          [name]: name,
        }));
      } else {
        setFilter((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      }
    } else {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  const submitHandler = (e) => {
    e.preventDefault();
    console.log(filter);
    localStorage.setItem("social-preferences", JSON.stringify(filter));
    navigate("/social/dashboard");
  };
  //console.log(filter);
  const isPremium = currentuserData?.isPremium;
  // console.log(myData);

  const divStyle = {
    backgroundImage: `url(${selectAfter})`,
  };
  // console.log(filter);
  // multirange
  const [minMax, setMinMax] = useState({
    minValue: 18,
    maxValue: 80,
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
  const resetForm = () => {
    setFilter({
      looking: "",
      age: "",
      radius: "",
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
    navigate("/social/dashboard");
  };
  return (
    <div className=" py-4 px-0 looking-for">
      <form onSubmit={(e) => submitHandler(e)} className=" mt-3 text-white">
        <div className="self-summary rounded-0">
          <div className="form-control h-auto bg-transparent font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06 px-4">
            <label className="font-weight-600 font-18-100 mb-2 d-flex justify-content-between w-100">
              <span>Age Range</span>
              <span>
                {minMax.minValue} {minMax.maxValue}
              </span>
            </label>
            <MultiRangeSlider
              className="shadow-none border-0 py-0 px-2 py-2"
              min={18}
              max={80}
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
          {/* <div className="form-control h-auto bg-transparent font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06 px-4">
            <label className="font-weight-600 font-18-100 mb-2 d-flex justify-content-between w-100">
              KM RADIUS
            </label>
            <input
              type="range"
              className="form-control-range w-100"
              min="0"
              max="250"
              step="50"
              name="radius"
              value={filter.radius}
              onChange={(e) =>
                setFilter((prevState) => ({
                  ...prevState,
                  radius: e.target.value,
                }))
              }
            ></input>
            <p className="rangetext d-flex w-100 justify-content-between mt-2 mb-2">
              <span>0km-10km</span>
              <span></span>
              <span className="text-end">10km-50km</span>
              <span className="text-end">50km-100km</span>
              <span className="text-end">100km-150km</span>
              <span className="text-end">150km-200km</span>
              <span className="text-end">200km-250km</span>
            </p>
          </div> */}
          <div className="form-control h-auto p-0 bg-transparent border-0 ">
            <select
              className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
              name="looking"
              onChange={(e) => formHandler(e)}
              value={filter.looking}
            >
              <option value="">What are you looking for</option>
              <option value="friendship">Friendship</option>
              <option value="dating">Dating</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0 ">
            <select
              className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
              onChange={(e) => formHandler(e)}
              name="radius"
              value={filter.radius}
            >
              <option value="">KM RADIUS: 250 km</option>
              <option value="0-50">0km - 50km</option>
              <option value="50-100">50km - 100km</option>
              <option value="100-150">100km - 150km</option>
              <option value="150-200">150km - 200km</option>
              <option value="200-250">200km - 250km</option>
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
              className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
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
              className="auth-input font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
              name="socialSetting"
              onChange={(e) => formHandler(e)}
              value={filter.socialSetting}
            >
              <option value="">Personality Type</option>
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
            <div className="self-summary rounded-0 border-0">
              <div className="form-control h-auto p-0 bg-transparent border-0 ">
                <select
                  className="auth-input px-4 font-16-social line-height-20px text-white border-0 w-100 border-bottom rounded-0 border-06"
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
                className="btn-group btn-group-toggle flex-column w-100"
                data-toggle="buttons-1"
              >
                {/* <label
                  className={`btn subscription-offer rounded-0 border-0 p-0 w-100 auth-input font-16-social border-0 w-100  ${
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
                  className={`btn subscription-offer rounded-0 p-0 w-100 auth-input font-16-social border-0 w-100 border-bottom rounded-0 border-06 ${
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
                  className={`btn subscription-offer rounded-0 p-0 w-100 auth-input border-0 w-100 border-bottom rounded-0 border-06 ${
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
        <h3 className="font-16-social font-weight-700 text-white px-4 mt-4 pt-2 mb-3">
          SORT BY
        </h3>
        <div className="self-summary border-0 rounded-0">
          <div
            className="btn-group btn-group-toggle flex-column w-100"
            data-toggle="buttons"
          >
            <label className="btn subscription-offer rounded-0 p-0 w-100 auth-input font-14-100 border-0 w-100 border-bottom rounded-0 border-06">
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
            <label className="btn subscription-offer rounded-0 p-0 w-100  auth-input font-14-100 border-0 w-100 border-bottom rounded-0 border-06">
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
              <div className="py-3 font-14-100 h-100 px-4 border-0 w-100 d-flex gap-2 align-items-center  justify-content-between font-weight-500">
                NEWEST
                <SelectedTick />
              </div>
            </label>
          </div>
        </div>
        {isPremium ? null : (
          <>
            <p className="font-18 font-weight-500 text-white text-center mt-4 pt-2">
              Advance filters (Premium members only)
            </p>
            <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center mx-5 mt-4 pt-3">
              <button
                onClick={() => navigate("/social/subscription")}
                className="green-btn mb-4 px-5"
                type="button"
              >
                Upgrade Now
              </button>
            </div>
            <div className="self-summary rounded-0 border-0">
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
                  className={`btn subscription-offer rounded-0 p-0 w-100 auth-input font-14-100 border-0 w-100 border-bottom rounded-0 border-06 ${
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
                  <div className="py-3 font-14 mb px-4 border-0 w-100 d-flex gap-2 align-items-center justify-content-between font-weight-500">
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
              <div className="form-control h-auto p-0 bg-transparent border-0 border-bottom rounded-0 border-06">
                <select
                  style={divStyle}
                  className="auth-input px-4 font-16-social line-height-20px text-white border-0 w-100"
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
          <button
            type="button"
            className="green-btn-outline text-primary-green w-max-content px-3"
            onClick={() => resetForm()}
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            Clear
          </button>
          <button className="green-btn px-5" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default LookingFor;
