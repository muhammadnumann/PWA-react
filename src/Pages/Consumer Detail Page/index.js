import React from "react";
import DistanceIcon from "../../assets/Images/Distance";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import DispensryProductIcon from "../../assets/Images/Dispensry1";
import MobHeartIcon from "../../assets/Images/MobHeart";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuantityIcon from "../../assets/Images/Quantity";
import TimerIcon from "../../assets/Images/Timer";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import { CreateChat, CreatePromptMessage } from "../../Api";
import EmptyDataImage from "../../assets/Images/EmptyData";
import SendMailIcon from "../../assets/Images/SendMail";

const ConsumerDetailPage = () => {
  const routeParams = useParams();
  const [dispensary, setDispensary] = useState([]);
  const [others, setOthers] = useState([]);
  const [categoryFilter, setcategoryFilter] = useState([]);
  const navigate = useNavigate();
  const [conversationType, setconversationType] = useState("");
  const [currentuserData, setcurrentuserData] = useState();
  const [chatData, setChatData] = useState({
    senderId: "",
    receiverId: "",
  });
  const [options, setOptions] = useState([
    {
      id: 1,
      value: "Sativa",
      label: "Sativa",
      icon: "",
      userType: "consumer",
    },
    {
      id: 2,
      value: "Indica",
      label: "Indica",
      icon: "",
      userType: "consumer",
    },
    {
      id: 3,
      value: "Hybrid",
      label: "Hybrid",
      icon: "",
      userType: "consumer",
    },
    {
      id: 4,
      value: "CBD",
      label: "CBD",
      icon: "",
      userType: "consumer",
    },
  ]);

  const GetDispensarys = async (GetUserItemUrl) => {
    try {
      const fetchData = await Axios.get(GetUserItemUrl);
      console.log(fetchData);
      setDispensary(fetchData?.data?.data);
      let GetSharedByUserUrl = `${
        process.env.REACT_APP_API_URI
      }users/getAllData/?latlang=${
        fetchData?.data?.data?.location?.coordinates[0]
      },${fetchData?.data?.data?.location?.coordinates[1]}&userId=${
        fetchData?.data?.data?.userId?._id
      }&userType=consumer&category=${categoryFilter.join(",")}`;

      GetOthersByUser(GetSharedByUserUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const GetOthersByUser = async (GetOthersUrl) => {
    try {
      const fetchData = await Axios.get(GetOthersUrl);
      console.log(fetchData);
      setOthers(fetchData?.data?.result);
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
    let GetUserItemUrl = `${process.env.REACT_APP_API_URI}userItem/${routeParams.id}?latlang=${data.location?.coordinates[0]},${data.location?.coordinates[1]}`;
    GetDispensarys(GetUserItemUrl);
    setChatData((prevState) => ({
      ...prevState,
      senderId: data._id,
    }));
  }, [routeParams.id]);

  const images = [];
  if (dispensary?.photo) {
    if (Array.isArray(dispensary.photo)) {
      dispensary.photo.forEach((data) => {
        images.push({
          original: `${process.env.REACT_APP_PORT}/${data}`,
          thumbnail: `${process.env.REACT_APP_PORT}/${data}`,
        });
      });
    } else {
      images.push({
        original: `${process.env.REACT_APP_PORT}/${dispensary.photo}`,
        thumbnail: `${process.env.REACT_APP_PORT}/${dispensary.photo}`,
      });
    }
  }

  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === value ? { ...option, checked } : option
      )
    );
    if (categoryFilter.includes(value)) {
      setcategoryFilter((prevStrings) =>
        prevStrings.filter((string) => string !== value)
      );
    } else {
      setcategoryFilter((prevArray) => [...prevArray, value]);
    }
  }
  useEffect(() => {
    let GetSharedByUserUrl = `${
      process.env.REACT_APP_API_URI
    }users/getAllData/?latlang=${dispensary.location?.coordinates[0]},${
      dispensary.location?.coordinates[1]
    }&userId=${
      dispensary?.userId?._id
    }&userType=consumer&category=${categoryFilter.join(",")}`;

    GetOthersByUser(GetSharedByUserUrl);
  }, [
    categoryFilter,
    dispensary?.location?.coordinates,
    dispensary?.userId?._id,
    dispensary?.userId?.userType,
  ]);
  const categrory = "userItem";

  return (
    <div className="product-user-profile">
      <div className="container mx-auto">
        <div className="d-sm-flex d-none align-items-center gap-2 font-18-100 font-weight-500 mb-4 ps-12">
          <Link to={"/home"} className="text-primary-green cr-p">
            Home
          </Link>{" "}
          &gt;
          <span
            className="text-primary-green cr-p"
            onClick={() => navigate(-1)}
          >
            Seed / Bud Swap
          </span>
          &gt;
          <span className="text-grey">{dispensary?.strainName}</span>
        </div>
        <div className="row m-0 seed-card flex-row">
          <div className="col-lg-5 ps-0">
            <ImageGallery
              items={images}
              showFullscreenButton={false}
              showPlayButton={false}
              autoPlay={false}
              additionalClass="rounded-5"
              showIndex={true}
              renderRightNav={(onClick, disabled) => (
                <RightNav onClick={onClick} disabled={disabled} />
              )}
              renderLeftNav={(onClick, disabled) => (
                <LeftNav onClick={onClick} disabled={disabled} />
              )}
            />
          </div>
          <div className="col-lg-7 pe-0 ps-lg-3 ps-0 pt-lg-0 pt-5">
            <div className="ps-sm-0 ps-3">
              <div className="border-smx-bottom mb-4">
                <p className="mb-3 pb-3 font-32 font-weight-900">
                  {dispensary?.strainName}
                </p>
                <div className="d-flex gap-sm-5 gap-3 align-items-sm-center gap-2 mb-sm-4 mb-3 flex-sm-row flex-column">
                  <div>
                    <span className="d-flex gap-2 align-items-center font-18 mb-sm-4 mb-3 font-weight-500">
                      <DispensryProductIcon />
                      <span>{dispensary?.userId?.storeName}</span>
                    </span>
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                      <DistanceIcon />
                      <span>{dispensary?.distance} Away </span>
                    </span>
                  </div>
                  <div>
                    <div className="d-flex gap-2 align-items-center flex-wrap mb-sm-4 mb-3">
                      <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                        <RatingIcon />
                        <span>{dispensary?.userId?.ratingsAverage}</span>
                      </span>
                      <span className="font-18-100 text-grey font-weight-400">
                        <span>
                          ({dispensary?.userId?.ratingsQuantity} Reviews)
                        </span>
                      </span>
                    </div>
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                      <TimerIcon />
                      <span>Store Hours: 09:00 To 17:00 </span>
                    </span>
                  </div>
                </div>

                <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-3">
                  <LocationIcon />
                  <span>{dispensary?.userId?.location?.address}</span>
                </span>
              </div>
              <p className="font-24 font-weight-700">
                {dispensary?.userId?.fullName}
              </p>
              <p className="mt-3 font-18 font-weight-500">
                {dispensary?.description}
              </p>

              <div className="d-flex flex-sm-row flex-column justify-content-between align-items-center gap-sm-4 gap-3 mt-md-5 mt-3 pt-4">
                <div
                  onClick={() =>
                    CreateChat(
                      chatData?.senderId,
                      dispensary?.userId?._id,
                      navigate,
                      conversationType
                    )
                  }
                  className="cr-p green-btn text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-sm-2 gap-2"
                >
                  <span>Messaege </span>
                  <span className="send-message w-max-content">
                    <SendMailIcon />
                  </span>
                </div>
                <div
                  onClick={() =>
                    CreatePromptMessage(
                      chatData.senderId,
                      dispensary?.userId?._id,
                      dispensary?._id,
                      categrory,
                      navigate,
                      conversationType
                    )
                  }
                  className="cr-p green-btn text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-sm-2 gap-2"
                >
                  <span>Swap </span>
                  <span className="send-message w-max-content">
                    <SendMailIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="d-flex gap-2 align-items-center flex-wrap font-32 font-weight-700 pt-3 mt-5 ms-12 bordered-heading">
          Other Strains Available Shared By:
          <span className="text-primary-green">
            {dispensary?.userId?.fullName}
          </span>
        </h3>
        <div className="d-flex gap-3 overflow-x-auto all-products-link pt-4 ms-12">
          {options.map((option) => {
            return (
              <label
                key={option.value}
                className={`product-item cr-p ${
                  option.checked ? "active" : ""
                }`}
              >
                <input
                  className="d-none"
                  type="checkbox"
                  value={option.value}
                  checked={option.checked}
                  onChange={handleCheckboxChange}
                />
                {option.icon} {option.label}
              </label>
            );
          })}
        </div>

        <div className="seeds-card-main row m-0 pt-5">
          {others?.length !== 0 ? (
            (others || [])?.map((data, index) => {
              return (
                <div
                  className="col-xl-3 col-lg-4  col-md-6 mb-4 seed-card-col"
                  key={index}
                >
                  <Link
                    to={`/home/dispensary/${data._id}`}
                    className="seed-card position-relative text-black"
                  >
                    <div className="row m-0 flex-sm-column w-100">
                      <div className="col-4 col-sm-12 p-0">
                        <img
                          className="w-100 intro-img cards-image-style"
                          src={`${process.env.REACT_APP_PORT}/${data.photo}`}
                          alt=""
                        />
                      </div>
                      <div className="col-8 col-sm-12 p-0">
                        <div className="ps-sm-0 ps-3">
                          <p className="my-sm-4 mb-3 font-24 font-weight-700">
                            {data?.strainName}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 flex-wrap gap-2">
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                              <QuantityIcon />
                              {data?.strainName}
                            </span>
                          </div>
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-2 ">
                            <LocationIcon />
                            <span className="cut-text">
                              {data?.userId?.location?.address}
                            </span>
                          </span>
                        </div>
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

export default ConsumerDetailPage;

const RightNav = React.memo(({ disabled, onClick }) => {
  return (
    <button
      type="button"
      className="image-gallery-icon image-gallery-right-nav"
      disabled={disabled}
      onClick={onClick}
      aria-label="Next Slide"
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.73023 0.29552C9.14137 -0.0985067 9.80795 -0.0985067 10.2191 0.29552L17.0833 6.874C18.305 8.04493 18.305 9.95507 17.0833 11.126L10.2191 17.7045C9.80795 18.0985 9.14137 18.0985 8.73023 17.7045C8.31909 17.3105 8.31909 16.6716 8.73023 16.2776L15.5944 9.69911C15.9939 9.31623 15.9939 8.68377 15.5944 8.30089L8.73023 1.72242C8.31909 1.32839 8.31909 0.689547 8.73023 0.29552Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.308354 0.29552C0.719492 -0.0985067 1.38608 -0.0985067 1.79722 0.29552L8.66138 6.874C9.88316 8.04493 9.88316 9.95507 8.66138 11.126L1.79722 17.7045C1.38608 18.0985 0.719492 18.0985 0.308354 17.7045C-0.102785 17.3105 -0.102785 16.6716 0.308354 16.2776L7.17252 9.69911C7.57202 9.31623 7.57202 8.68377 7.17252 8.30089L0.308354 1.72242C-0.102785 1.32839 -0.102785 0.689547 0.308354 0.29552Z"
          fill="white"
        />
      </svg>
    </button>
  );
});

const LeftNav = React.memo(({ disabled, onClick }) => {
  return (
    <button
      type="button"
      className="image-gallery-icon image-gallery-left-nav"
      disabled={disabled}
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.26977 0.29552C8.85863 -0.0985067 8.19205 -0.0985067 7.78091 0.29552L0.916746 6.874C-0.305037 8.04493 -0.305037 9.95507 0.916746 11.126L7.78091 17.7045C8.19205 18.0985 8.85863 18.0985 9.26977 17.7045C9.68091 17.3105 9.68091 16.6716 9.26977 16.2776L2.40561 9.69911C2.0061 9.31623 2.0061 8.68377 2.40561 8.30089L9.26977 1.72242C9.68091 1.32839 9.68091 0.689547 9.26977 0.29552Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.6916 0.29552C17.2805 -0.0985067 16.6139 -0.0985067 16.2028 0.29552L9.33862 6.874C8.11684 8.04493 8.11684 9.95507 9.33862 11.126L16.2028 17.7045C16.6139 18.0985 17.2805 18.0985 17.6916 17.7045C18.1028 17.3105 18.1028 16.6716 17.6916 16.2776L10.8275 9.69911C10.428 9.31623 10.428 8.68377 10.8275 8.30089L17.6916 1.72242C18.1028 1.32839 18.1028 0.689547 17.6916 0.29552Z"
          fill="white"
        />
      </svg>
    </button>
  );
});
