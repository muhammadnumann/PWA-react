import React, { useEffect, useState } from "react";
import DistanceIcon from "../../assets/Images/Distance";
import LocationIcon from "../../assets/Images/Location";
import RatingIcon from "../../assets/Images/Rating";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import SeedICon from "../../assets/Images/Seed";
import DispensaryIcon from "../../assets/Images/Dispensary";
import CannbisIcon from "../../assets/Images/Cannbis";
import HeadShopIcon from "../../assets/Images/HeadShop";
import CountIcon from "../../assets/Images/Count";
import PriceIcon from "../../assets/Images/Price";
import { useRef } from "react";

function Spy(props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const [data, setData] = useState([]);
  const GetHeadShops = async (GetHeadShopsUrl) => {
    try {
      const fetchData = await Axios.get(GetHeadShopsUrl);
      setData(fetchData.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    const GetHeadShopsUrl = `${process.env.REACT_APP_API_URI}${props.data.category}/${props.data.pId}?latlang=${data?.location?.coordinates[0]},${data?.location?.coordinates[1]}`;
    GetHeadShops(GetHeadShopsUrl);
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
      console.log("called handleClickOutside");
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown">
      <div className="p-0 map-dropbtn" onClick={() => setIsOpen(!isOpen)}>
        {props.data.category === "seedStore" && <SeedICon />}
        {props.data.category === "dispensary" && <DispensaryIcon />}
        {props.data.category === "cannabisLounge" && <CannbisIcon />}
        {props.data.category === "headShop" && <HeadShopIcon />}
      </div>
      <div
        className={`dropdown-menu map-comp-dropmenu ${
          isOpen ? "d-block" : "d-none"
        }`}
        aria-labelledby="dropdownMenuButton"
      >
        <img
          className="w-100 intro-img"
          src={`${process.env.REACT_APP_PORT}/${
            Array.isArray(data.photo) ? data.photo[0] : data.photo
          }`}
          alt=""
        />

        <div className="p-3">
          <p className="mb-3 font-18 font-weight-700">{data?.strainName}</p>
          <div className="d-flex gap-5 align-items-center mb-3 pb-1">
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
              <span>{data.userId?.fullName}</span>
            </span>

            <span className="d-flex gap-2 align-items-center font-13 font-weight-700">
              <RatingIcon />
              <span>5.0</span>
            </span>
          </div>
          <div className="d-flex gap-5 align-items-center mb-3 pb-1">
            <span className="d-flex gap-1 align-items-center font-13 font-weight-500">
              <DistanceIcon />
              <span> {data.distance} Away</span>
            </span>
            <span className="d-flex gap-1 align-items-center font-13 font-weight-500">
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
          <span className="d-flex gap-2 align-items-center font-13 font-weight-500">
            <LocationIcon />
            <span>{data.userId?.location.address}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Spy;
