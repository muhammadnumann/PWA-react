import React from "react";
import productuser from "../../assets/Images/productuser-1.svg";
import DistanceIcon from "../../assets/Images/Distance";
import CountIcon from "../../assets/Images/Count";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import SendMailIcon from "../../assets/Images/SendMail";
import DispensryProductIcon from "../../assets/Images/Dispensry1";
import MobHeartIcon from "../../assets/Images/MobHeart";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuantityIcon from "../../assets/Images/Quantity";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import { CreateChat, CreatePromptMessage } from "../../Api";
import FavouriteIcon from "../../assets/Images/FavouriteIcon";
import EmptyDataImage from "../../assets/Images/EmptyData";

const SeedUserProfile = () => {
  const routeParams = useParams();
  const [seed, setSeed] = useState([]);
  const [others, setOthers] = useState([]);
  const [currentuserData, setcurrentuserData] = useState();
  const [selectedQuantity, setselectedQuantity] = useState("");
  const [conversationType, setconversationType] = useState("");
  const [selectedStrain, setselectedStrain] = useState("");
  const [chatData, setChatData] = useState({
    senderId: "",
    receiverId: "",
  });
  const [showMore, setShowMore] = useState(false);

  const GetSeeds = (GetSeedUrl) => {
    Axios.get(GetSeedUrl)
      .then((response) => {
        setSeed(response.data.data);
        GetOthersByUser(
          `${process.env.REACT_APP_API_URI}seedStore/userseedStore?userId=${response.data.data.userId?._id}`
        );
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
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
    let GetSeedUrl = `${process.env.REACT_APP_API_URI}seedStore/${routeParams.id}?latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    setChatData((prevState) => ({
      ...prevState,
      senderId: data._id,
    }));
    GetSeeds(GetSeedUrl);
  }, [routeParams.id]);

  const navigate = useNavigate();

  const images = [];
  if (seed?.photo) {
    if (Array.isArray(seed.photo)) {
      seed.photo.forEach((data) => {
        images.push({
          original: `${process.env.REACT_APP_PORT}/${data}`,
          thumbnail: `${process.env.REACT_APP_PORT}/${data}`,
        });
      });
    } else {
      images.push({
        original: `${process.env.REACT_APP_PORT}/${seed.photo}`,
        thumbnail: `${process.env.REACT_APP_PORT}/${seed.photo}`,
      });
    }
  }

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
        const currentUser = localStorage.getItem("userdata");
        let data = JSON.parse(currentUser);
        let GetHeadShopsUrl = `${process.env.REACT_APP_API_URI}seedStore/${routeParams.id}?latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
        GetSeeds(GetHeadShopsUrl);
        toast.success(response.data.messgae);
      })
      .catch((error) => {
        toast.error(error?.response.data.message);
        console.log(error);
      });
  };

  return (
    <div className="product-user-profile">
      <div className="container mx-auto">
        <div className="d-sm-flex d-none align-items-center gap-2 font-18-100 font-weight-500 mb-4 ps-12">
          <Link to={"/home"} className="text-primary-green">
            Home
          </Link>
          &gt;
          <span
            onClick={() => navigate(-1)}
            className="text-primary-green cr-p"
          >
            Seeds
          </span>
          &gt;
          <span className="text-grey">
            {seed.strainName || seed.productName}
          </span>
        </div>
        <div className="row m-0">
          <div className="col-xl-9 col-lg-8 mb-md-0 pb-lg-0 mb-4 pb-3">
            <div className="seed-card product-profile d-flex flex-row align-items-start justify-content-between gap-3 flex-xl-nowrap flex-wrap">
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
              <div className="ps-sm-0 ps-3">
                <div className="border-smx-bottom mb-4">
                  <p className="mb-3 pb-3 font-32 font-weight-900">
                    {seed.productName}
                  </p>
                  <div className="d-flex gap-5 align-items-center gap-2 mb-sm-4 mb-2 flex-wrap">
                    <div>
                      <span className="d-flex gap-2 align-items-center font-18 mb-sm-4 mb-2 font-weight-500">
                        <DispensryProductIcon />
                        <span>{seed?.userId?.storeName}</span>
                      </span>

                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                        <DistanceIcon />
                        <span>{seed.distance}</span>
                      </span>
                    </div>
                    <div>
                      <div className="d-flex gap-2 align-items-center flex-wrap mb-sm-4 mb-2">
                        <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                          <RatingIcon />
                          <span>{seed?.userId?.ratingsAverage}</span>
                        </span>
                        <span className="font-18-100 text-grey font-weight-400">
                          <span>({seed?.userId?.ratingsQuantity} Reviews)</span>
                        </span>
                      </div>
                      <span className="d-flex  gap-2 align-items-center font-18 font-weight-500">
                        <CountIcon />
                        <span>{seed.quantity} Seeds</span>
                      </span>
                    </div>
                  </div>

                  <span className="d-flex gap-2 align-items-center font-18 font-weight-500 mb-sm-4 pb-sm-1 mb-3">
                    <LocationIcon />
                    <span> {seed.userId?.location?.address}</span>
                  </span>
                </div>
                <p className="font-24 font-weight-700">
                  {seed?.userId?.fullName}
                </p>
                <hr />
                <p className="mt-3 font-18 font-weight-500">
                  {/* {seed.description} */}
                  {seed.description && seed.description.length > 100
              ? showMore
                ? seed.description
                : `${seed.description.substring(0, 100)}`
              : seed.description}
          </p>
          {seed.description && seed.description.length > 100 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="show-more-button "
            >
              {showMore ? "See less" : "See more"}
            </button>
          )}
                

                <div className="d-flex flex-sm-row flex-column justify-content-between align-items-center gap-4 mt-5 pt-4">
                  <button
                    onClick={() =>
                      favouriteHandler(
                        currentuserData._id,
                        seed._id,
                        seed.category
                      )
                    }
                    className="green-btn-outline text-primary-green ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 py-2 gap-2"
                  >
                    <span>
                      {seed.favourite &&
                      seed.favourite.includes(currentuserData._id)
                        ? "Mark Unfavourite"
                        : "Mark Favourite"}
                    </span>
                    <span className="icon-green-bg">
                      {seed.favourite &&
                      seed.favourite.includes(currentuserData._id) ? (
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
                        seed.userId._id,
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

                  {seed?.userId?.location?.phone && (
                    <a
                      href={`tel:${seed?.userId?.location?.phone}`}
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
          <div className="col-xl-3 col-lg-4">
            <div className="seed-card flex-column">
              <div className="d-flex flex-lg-column justify-content-lg-center justify-content-between align-items-center mb-lg-5 mb-3">
                <img
                  src={
                    currentuserData?.photo
                      ? `${process.env.REACT_APP_PORT}/${currentuserData?.photo}`
                      : productuser
                  }
                  alt=""
                  className="mb-md-4 user-profile-image"
                />
                <div className="d-flex flex-column gap-3">
                  <p className="font-24 font-weight-700 mb-lg-3">
                    {seed?.userId?.fullName}
                  </p>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <span className="d-flex gap-2 align-items-center font-24 font-weight-700">
                      <RatingIcon />
                      <span>{seed?.userId?.ratingsAverage}</span>
                    </span>
                    <span className="font-18-100 text-grey font-weight-400">
                      <span>({seed?.userId?.ratingsQuantity} Reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-md-4 mb-3 flex-wrap gap-2">
                <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                  <DistanceIcon />
                  <span>3 km Away</span>
                </span>
                <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                  <CountIcon />
                  <span>20 Seeds</span>
                </span>
              </div>

              <span className="d-flex gap-2 align-items-start font-18 font-weight-500 mb-5 pb-4">
                <div>
                  <LocationIcon />
                </div>
                <span>{seed.userId?.location?.address}</span>
              </span>
              <Link
                to={`/profile/${seed?.userId?._id}`}
                className="green-btn w-auto ps-3 pe-1 d-flex align-items-center justify-content-between font-18 py-sm-3 user text-white"
              >
                <span>View Profile </span>
                <span className="icon-green-bg bg-light-green">
                  <FavouriteIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <h3 className="d-flex gap-2 align-items-center flex-wrap font-32 font-weight-700 pt-3 mt-5 ms-12 bordered-heading">
          Other Strains Available Shared By:
          <span className="text-primary-green text-capitalize">
            {seed?.userId?.fullName}
          </span>
        </h3>

        <div className="row m-0 pt-4">
          <div className="col-lg-3 col-md-6  bg-transparent border-0 mb-3">
            <label className="mb-2 font-weight-700 font-18-100">Quantity</label>
            <select
              className="auth-input height-56 bg-white"
              value={selectedQuantity}
              onChange={(e) => {
                setselectedQuantity(e.target.value);
                GetOthersByUser(
                  `${
                    process.env.REACT_APP_API_URI
                  }seedStore/userseedStore?quantity=${e.target.value}${
                    selectedStrain ? `&postStrain=${selectedStrain}` : ""
                  }&userId=${seed?.userId?._id}`
                );
              }}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-4"}>1-4</option>
              <option value={"5-10"}>5-10 </option>
              <option value={"11-15"}>10-15</option>
              <option value={"16-20"}>15-20</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6  bg-transparent border-0">
            <label className="mb-2 font-weight-700 font-18-100"> Strain</label>
            <select
              className="auth-input height-56 bg-white"
              value={selectedStrain}
              onChange={(e) => {
                setselectedStrain(e.target.value);
                GetOthersByUser(
                  `${process.env.REACT_APP_API_URI}seedStore/userseedStore?${
                    selectedQuantity ? `quantity=${selectedQuantity}&` : ""
                  }postStrain=${e.target.value}&userId=${seed?.userId?._id}`
                );
              }}
            >
              <option value={""}>- Select Strain -</option>
              <option value="Sativa">Sativa</option>
              <option value="Indica">Indica</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CBD">CBD</option>
            </select>
          </div>
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
                    to={`/home/${data.category}/${data._id}`}
                    className="seed-card position-relative text-black"
                  >
                    <div className="row m-0 flex-sm-column w-100">
                      <div className="col-4 col-sm-12 p-0">
                        <img
                          className="w-100 intro-img cards-image-style"
                          src={`${process.env.REACT_APP_PORT}/${data.photo[0]}`}
                          alt=""
                        />
                      </div>
                      <div className="col-8 col-sm-12 p-0">
                        <div className="ps-sm-0 ps-3">
                          <p className="my-sm-4 mb-3 font-24 font-weight-700">
                            {data.productName}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mb-sm-3 mb-2 flex-wrap gap-2">
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500">
                              <QuantityIcon />
                              {data.cost}
                            </span>
                            <span className="d-flex gap-2 align-items-center font-18 font-weight-500 ">
                              <CountIcon />
                              <span>{data.quantity} Seeds</span>
                            </span>
                          </div>
                          <span className="d-flex gap-2 align-items-center font-18 font-weight-500 ">
                            <LocationIcon />
                            <span className="cut-text">
                              {data.userId?.location?.address}
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

export default SeedUserProfile;

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
