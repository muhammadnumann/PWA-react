import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import DistanceIcon from "../../../assets/Images/Distance";
import LocationIcon from "../../../assets/Images/Location";
import RatingIcon from "../../../assets/Images/Rating";
import CountIcon from "../../../assets/Images/Count";
import PriceIcon from "../../../assets/Images/Price";
import { useEffect } from "react";
import Axios from "../../../axios/Axios";
import { toast } from "react-toastify";
import SendMailIcon from "../../../assets/Images/SendMail";
import { CreatePromptMessage } from "../../../Api";
import axios from "axios";
import SeedICon from "../../../assets/Images/Seed";
import HeadShopIcon from "../../../assets/Images/HeadShop";
import DispensaryIcon from "../../../assets/Images/Dispensary";
import CannbisIcon from "../../../assets/Images/Cannbis";

const AnyReactComponent = ({
  navigateTo,
  data,
  infoId,
  setInfoId,
  senderId,
  receiverId,
  productId,
  category,
  key,
}) => {
  console.log(data);
  const [conversationType, setconversationType] = useState("");
  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const type = localStorage.getItem("platform");
    setconversationType(type);
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
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
  const navigate = useNavigate();
  return (
    <div className="infowindow-main" key={key}>
      {infoId && infoId === data._id && (
        <div className="custom-infowindow">
          <div className="info-container">
            <Image
              style={{ width: "100%", height: "180px" }}
              className="img-fluid"
              src={
                Array.isArray(data.photo)
                  ? `${process.env.REACT_APP_PORT}/${data.photo[0]}`
                  : `${process.env.REACT_APP_PORT}/${data.photo}`
              }
            />
            <div className="p-3">
              <p
                className="mb-3 font-18 font-weight-700 map-link-nav"
                onClick={() => navigateTo(`/home/${data.category}/${data._id}`)}
              >
                {data?.strainName ||
                  data.productName ||
                  data.brandName ||
                  data.accessories}
              </p>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start flex-wrap mb-2 pb-1 gap-2">
                <span className="d-flex gap-2 align-items-center font-13  font-weight-500 ">
                  <svg
                    width={13}
                    height={18}
                    viewBox="0 0 13 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M6.50284 0C4.08381 0 2.11719 1.91701 2.11719 4.27503C2.11719 6.58804 3.97301 8.46005 6.39205 8.54105C6.46591 8.53205 6.53977 8.53205 6.59517 8.54105C6.61364 8.54105 6.62287 8.54105 6.64133 8.54105C6.65057 8.54105 6.65057 8.54105 6.6598 8.54105C9.02344 8.46005 10.8793 6.58804 10.8885 4.27503C10.8885 1.91701 8.92187 0 6.50284 0Z"
                      fill="#5D8B2F"
                    />
                    <path
                      d="M11.1903 10.9352C8.61435 9.26119 4.41335 9.26119 1.81889 10.9352C0.646307 11.7002 0 12.7352 0 13.8422C0 14.9492 0.646307 15.9752 1.80966 16.7312C3.10227 17.5772 4.80114 18.0002 6.5 18.0002C8.19886 18.0002 9.89773 17.5772 11.1903 16.7312C12.3537 15.9662 13 14.9402 13 13.8242C12.9908 12.7172 12.3537 11.6912 11.1903 10.9352Z"
                      fill="#5D8B2F"
                    />
                  </svg>
                  <span className="cut-text">{data.cost}</span>
                </span>

                <span className="d-flex gap-2 align-items-center font-13 font-weight-700">
                  <RatingIcon />
                  <span>5.0</span>
                </span>
              </div>
              <div className="row mx-0 mb-2 gap-lg-0 gap-2">
                <div className="col-lg-6 col-12 p-0">
                  <span className="d-flex gap-1 align-items-center font-13 font-weight-500 w-100">
                    <DistanceIcon />
                    <span className="cut-text">{data.distance} Away</span>
                  </span>
                </div>
                <div className="col-lg-6 col-12 p-0">
                  <span className="d-flex justify-content-lg-end gap-1 align-items-center font-13 font-weight-500 w-100">
                    {data.quantity ? (
                      <CountIcon />
                    ) : (
                      <>{data.cost ? <PriceIcon /> : <PriceIcon />}</>
                    )}
                    {data.quantity ? (
                      `Seeds: ${data.quantity}`
                    ) : (
                      <>
                        {data.cost
                          ? `Fees: $${data.cost}`
                          : `Entry Fee: $${data.entryFee}`}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <span className="d-flex gap-2 align-items-center font-13 font-weight-500">
                <LocationIcon />
                <span style={{ lineHeight: "18px" }} className="cut-text">
                  {data.userId?.location.address}
                </span>
              </span>
              {currentuserData?.userType === "consumer" &&
                data?.userId.userType === "consumer" && (
                  <div
                    onClick={() =>
                      CreatePromptMessage(
                        senderId,
                        receiverId,
                        productId,
                        category,
                        navigate,
                        conversationType
                      )
                    }
                    className="green-btn text-white ps-3 pe-1 d-flex align-items-center justify-content-between font-18 mt-3 py-0 gap-2 height-42 rounded-2"
                  >
                    <span>Swap </span>
                    <span className="send-message w-max-content message-map">
                      <SendMailIcon />
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {data.category === "dispensary" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <DispensaryIcon />
        </div>
      )}
      {data.category === "headShop" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <HeadShopIcon />
        </div>
      )}
      {data.category === "cannabisLounge" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <CannbisIcon />
        </div>
      )}
      {data.category === "seedStore" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <SeedICon />
        </div>
      )}
      {data.category === "growDepot" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <SeedICon />
        </div>
      )}
      {data.userId.userType === "consumer" && (
        <div
          className="map-dropbtn"
          onClick={() => setInfoId(data._id)}
          style={{ fontSize: "30px", cursor: "pointer" }}
        >
          <SeedICon />
        </div>
      )}
    </div>
  );
};

const GoogleMapNew = ({ markersData }) => {
  const [infoId, setInfoId] = useState("");

  // console.log({ infoId });

  const navigate = useNavigate();

  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
  }, []);

  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentuserData(fetchData?.data?.data?.doc);
      setMapCenter({
        lat: fetchData?.data?.data?.doc?.location?.coordinates[1],
        lng: fetchData?.data?.data?.doc?.location?.coordinates[0],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const defaultProps = {
    zoom: 11,
  };
  const [mapCenter, setMapCenter] = useState({
    lat: currentuserData?.location?.coordinates[1],
    lng: currentuserData?.location?.coordinates[0],
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userdata"));
    setMapCenter({
      lat: currentUser?.location?.coordinates[1],
      lng: currentUser?.location?.coordinates[0],
    });
  }, []);

  return (
    <div className="h-100 bg-white rounded-4 p-3">
      {markersData && (
        <div className="map-style-main">
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP }}
            defaultCenter={mapCenter}
            defaultZoom={defaultProps.zoom}
            onClick={() => setInfoId("")}
          >
            {markersData &&
              markersData.length > 0 &&
              markersData.map((data, index) => (
                <AnyReactComponent
                  key={index}
                  lat={data?.userId?.location?.coordinates[1]}
                  lng={data?.userId?.location?.coordinates[0]}
                  navigateTo={navigate}
                  data={data}
                  infoId={infoId}
                  setInfoId={setInfoId}
                  senderId={currentuserData?._id}
                  receiverId={data.userId._id}
                  category={data.category}
                  productId={data._id}
                />
              ))}
          </GoogleMapReact>
        </div>
      )}
    </div>
  );
};

export default GoogleMapNew;
