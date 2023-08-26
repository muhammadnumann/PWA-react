import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import CalendarIcon from "../../assets/Images/Calendar";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";

const libraries = ["places"];
const SocialUserDetail = () => {
  const [value, onChange] = useState("");
  const [yearPlaceholderText, setYearPlaceholderText] = useState("Enter");
  const [monthPlaceholderText, setMonthPlaceholderText] = useState("Your");
  const [dayPlaceholderText, setDayPlaceholderText] = useState("DOB");
  const navigate = useNavigate();
  const [userDetail, setuserDetail] = useState({
    age: "",
    province: "",
    userType: "",
    address: "",
    retailerType: "",
  });
  const [minimumAge, setMinimumAge] = useState(18);
  const [selectedMessage, setSelectedMessage] = useState("");
  useEffect(() => {
    if (userDetail.province === "AB") {
      setMinimumAge(18);
      setSelectedMessage("You must be 18+ years to enter.");
    } else if (
      userDetail.province === "NS" ||
      userDetail.province === "NB" ||
      userDetail.province === "ON" ||
      userDetail.province === "MB" ||
      userDetail.province === "SK" ||
      userDetail.province === "BC" ||
      userDetail.province === "YT" ||
      userDetail.province === "NT" ||
      userDetail.province === "NU"
    ) {
      setMinimumAge(19);
      setSelectedMessage("You must be 19+ years to enter.");
    } else {
      setMinimumAge(21);
      setSelectedMessage("You must be 21+ years to enter.");
    }
  }, [userDetail.province]);
  const [currentuserData, setcurrentuserData] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
    setuserDetail({
      province: data?.province,
      age: data?.age,
      userType: data?.userType?.toLowerCase(),
      address: data?.location.address,
      retailerType: data?.retailerType,
    });
    onChange(data.age);
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
    setuserDetail((prevState) => ({
      ...prevState,
      age: value,
    }));
    return () => {
      setuserDetail((prevState) => ({
        ...prevState,
        age: value,
      }));
    };
  }, [value]);

  const EditProfileUrl = `${process.env.REACT_APP_API_URI}users/profileUpdate/${currentuserData?._id}`;

  const formHandler = (e) => {
    const { name, value } = e.target;
    setuserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const inputRef = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setuserDetail((prevState) => ({
        ...prevState,
        address: place.formatted_address,
      }));
    }
  };

  const [isDateValid, setDateValid] = useState(true);

  const handleDatePickerChange = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const minimumAgeDate = new Date(
      currentDate.getFullYear() - minimumAge,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (selectedDate <= minimumAgeDate) {
      onChange(date);
      setDateValid(true);
    } else {
      onChange("");
      setDateValid(false);
    }
  };

  const isNextDisabled = !value || value === "";

  const AddUserDetail = async (EditProfileUrl) => {
    try {
      const fetchData = await Axios.patch(EditProfileUrl, userDetail);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.updateUser)
      );
      navigate("/social/userbio");
      toast.success("Detail Added Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      currentuserData?.userType &&
      currentuserData?.age &&
      currentuserData?.location.address
    ) {
      navigate("/social/userbio");
    } else AddUserDetail(EditProfileUrl);
  };

  const handleDatePickerFocus = () => {
    setYearPlaceholderText("YYYY");
    setMonthPlaceholderText("MM");
    setDayPlaceholderText("DD");
  };

  console.log(userDetail);
  return (
    <div className="max-width-521 min-width-521 mx-3 my-4 ">
      <h2 className="font-weight-700 text-white text-center font-24-social mb-4">
        User
      </h2>
      <p className="font-14 font-weight-500 text-primary-red pb-4 mb-2">
        <span className="font-weight-700">Warning:</span> you must be at atleast
        18 years old to sign up for app.
      </p>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <label className="text-white mb-2 font-weight-600 font-18-100">
            Province
          </label>
          <select
            className="auth-input"
            required
            name="province"
            onChange={(e) => formHandler(e)}
            value={userDetail?.province}
            disabled={currentuserData?.province ? true : false}
          >
            <option value="">Where are you from?</option>
            <option value="AB">Alberta(AB)</option>
            <option value="BC">British Columbia(BC)</option>
            <option value="MB">Manitoba(MB)</option>
            <option value="NL">Newfoundland and Labrador(NL)</option>
            <option value="NB">New Brunswick(NB)</option>
            <option value="NT">Northwest Territories(NT)</option>
            <option value="NS">Nova Scotia(NS)</option>
            <option value="NU">Nunavut(NU)</option>
            <option value="ON">Ontario(ON)</option>
            <option value="PE">Prince Edward Island (PE)</option>
            <option value="Quebec">Quebec(QC)</option>
            <option value="SK">Saskatchewan(SK)</option>
            <option value="YT">Yukon(YT)</option>
            <option value="AL">Alaska</option>
            <option value="AR">Arizona</option>
            <option value="CA">California</option>
            <option value="CL">Colorado</option>
            <option value="CO">Connecticut</option>
            <option value="IL">Illinois</option>
            <option value="MA">Maine</option>
            <option value="MS">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MO">Montana</option>
            <option value="NE">Nevada</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="OR">Oregon</option>
            <option value="VE">Vermont</option>
            <option value="VI">Virginia</option>
            <option value="WA">Washington</option>
          </select>
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <label className="text-white mb-2 font-weight-600 font-18-100">
            Your Age
          </label>
          {currentuserData?.age ? (
            <div className="auth-input d-flex align-items-center justify-content-between w-100">
              <input
                readOnly
                name="password"
                required
                type={"text"}
                placeholder="Password"
                className="password-input w-75"
                value={currentuserData?.age}
              />
            </div>
          ) : (
            <>
              <DatePicker
                onChange={handleDatePickerChange}
                value={value}
                className="auth-input"
                clearIcon={false}
                format="y-M-d"
                yearPlaceholder={yearPlaceholderText}
                monthPlaceholder={monthPlaceholderText}
                dayPlaceholder={dayPlaceholderText}
                calendarIcon={<CalendarIcon />}
                required={true}
                disabled={currentuserData?.age ? true : false}
                maxDate={new Date()}
                onFocus={handleDatePickerFocus}
              />
              {!isDateValid && (
                <p className="text-danger mt-1">{selectedMessage}</p>
              )}
            </>
          )}
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <label className="text-white mb-2 font-weight-600 font-18-100">
            Your Role
          </label>
          <select
            required
            className="auth-input"
            name="userType"
            value={currentuserData?.userType}
            onChange={(e) => formHandler(e)}
            disabled={currentuserData?.userType ? true : false}
          >
            <option value="">- Select Type -</option>
            <option value="retailer">Retailer</option>
            <option value="consumer">Consumer</option>
          </select>
        </div>
        {userDetail.userType === "retailer" && (
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Retailer Type
            </label>
            <select
              required
              className="auth-input"
              name="retailerType"
              value={currentuserData?.retailerType}
              onChange={(e) => formHandler(e)}
              disabled={currentuserData?.retailerType ? true : false}
            >
              <option value="">- Select Retailer Type -</option>
              <option value="dispensary">Dispensary</option>
              <option value="headshop">HeadShop</option>
              <option value="growdepot">Grow Depot</option>
              <option value="cannabis">Cannabis Lounge</option>
              <option value="seedbank">Seed Bank</option>
            </select>
          </div>
        )}
        {!currentuserData?.location.address ? (
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP}
              libraries={libraries}
            >
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
              >
                <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
                  <label className="text-white mb-2 font-weight-600 font-18-100">
                    Your Location
                  </label>
                  <input
                    disabled={
                      currentuserData?.hasOwnProperty("address") ? true : false
                    }
                    type="text"
                    required
                    className="auth-input"
                    placeholder="Enter Address"
                    value={userDetail.address}
                  />
                </div>
              </StandaloneSearchBox>
            </LoadScript>
          </div>
        ) : (
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Your Location
            </label>
            <input
              readOnly
              className="auth-input"
              type="email"
              placeholder="Email"
              required
              value={currentuserData?.location.address}
              name="email"
              onChange={(e) => formHandler(e)}
            />
          </div>
        )}
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
          <button
            className="green-btn custom-w min-width-208"
            disabled={isNextDisabled}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialUserDetail;
