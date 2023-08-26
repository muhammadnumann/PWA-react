import React, { useState } from "react";
import DatePicker from "react-date-picker";
import CalendarIcon from "../../assets/Images/Calendar";
import { useNavigate } from "react-router-dom";
import { PostCannabis } from "../../Api";
import { useEffect } from "react";
import UploadIcon from "../../assets/Images/Upload";

const CannabisLounge = () => {
  const [file, setFile] = useState(null);
  const [cannabis, setCannabis] = useState({
    event: JSON.parse(localStorage.getItem('signupData'))?.event || "",
    date: "",
    foodOfferd: JSON.parse(localStorage.getItem('signupData'))?.foodOfferd || "",
    brandName: JSON.parse(localStorage.getItem('signupData'))?.brandName || "",
    entryFee: JSON.parse(localStorage.getItem('signupData'))?.entryFee || "",
    ConnectToEventbrite: JSON.parse(localStorage.getItem('signupData'))?.ConnectToEventbrite || "",
    userId: JSON.parse(localStorage.getItem('signupData'))?.userId || "",
    photo: "",
  });

  const [id, setId] = useState();
  const navigate = useNavigate();
  const [value, onChange] = useState();

  useEffect(() => {
    setCannabis((prevState) => ({
      ...prevState,
      date: value,
    }));
    return () => {
      setCannabis((prevState) => ({
        ...prevState,
        date: value,
      }));
    };
  }, [value]);
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setCannabis((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)?._id,
    }));
    setId(JSON.parse(currentUser)?._id);
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setCannabis((prevState) => ({
        ...prevState,
        photo: Array.from(e.target.files),
      }));
      setFile(imageFile?.name);
    }
  };
  const formHandler = (e) => {
    const { name, value } = e.target;
    setCannabis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const dataSignup = localStorage.getItem('signupData') && JSON.parse(localStorage.getItem('signupData'));
    const formatedData = {
      event: cannabis.event,
      foodOfferd: cannabis.foodOfferd,
      brandName: cannabis.brandName,
      entryFee: cannabis.entryFee,
      ConnectToEventbrite: cannabis.ConnectToEventbrite,
      userId: cannabis.userId,
    }

    const finalData = {
      ...dataSignup,
      ...formatedData
    }

    localStorage.setItem('signupData', JSON.stringify(finalData));

    const data = new FormData();
    data.append("event", cannabis.event);
    data.append("date", cannabis.date);
    data.append("foodOfferd", cannabis.foodOfferd);
    data.append("brandName", cannabis.brandName);
    data.append("entryFee", cannabis.entryFee);
    data.append("ConnectToEventbrite", cannabis.ConnectToEventbrite);
    data.append("userId", id);
    data.append("photo", cannabis.photo);
    PostCannabis(data, navigate);
  };
  return (
    <div className="max-width-792">
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Select Event
            </label>
            <select
              className="auth-input"
              name="event"
              onChange={(e) => formHandler(e)}
              required
              defaultValue={cannabis.event}
            >
              <option value="">- Select Option -</option>
              <option value="Music/Band">Music / Band</option>
              <option value="ComedyShow">Comedy Show</option>
              <option value="SeshandPaint">Sesh and Paint</option>
              <option value="BBQ">BBQ</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Select Date
            </label>
            <DatePicker
              onChange={onChange}
              value={value}
              className="auth-input"
              clearIcon={false}
              format="y-M-d"
              dayPlaceholder="DD"
              yearPlaceholder="YYYY"
              monthPlaceholder="MM"
              calendarIcon={<CalendarIcon />}
              required={true}
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Food Offered
            </label>
            <select
              className="auth-input"
              name="foodOfferd"
              onChange={(e) => formHandler(e)}
              required
              defaultValue={cannabis.foodOfferd}
            >
              <option value="">- Select Option -</option>
              <option value="Shakes">Shakes</option>
              <option value="HotDogs/Burgers">HotDogs/Burgers</option>
              <option value="SoftDrinks">Soft Drinks</option>
              <option value="Nachos">Nachos</option>
              <option value="Edibles">Edibles</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Accessories for Use
            </label>
            <select
              className="auth-input"
              name="brandName"
              onChange={(e) => formHandler(e)}
              required
              defaultValue={cannabis.brandName}
            >
              <option value="">- Select Option -</option>
              <option value="Bongs">Bongs</option>
              <option value="Rig">Rig</option>
              <option value="Papers">Papers</option>
              <option value="Vaporizers">Vaporizers</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Entry Fees
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="number"
              className="auth-input"
              placeholder="$ 00"
              name="entryFee"
              value={cannabis.entryFee}
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Connect to Eventbrite
            </label>
            <div className="auth-input d-flex align-items-center justify-content-between">
              <input
                type="text"
                className="border-0 outline-0 w-75"
                onChange={(e) => formHandler(e)}
                name="ConnectToEventbrite"
                placeholder="Enter Link"
                value={cannabis.ConnectToEventbrite}
              />
              <svg
                width={23}
                height={23}
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.09117 14.2736C3.15391 15.2109 3.15391 16.7305 4.09117 17.6678L5.78823 19.3648C6.72548 20.3021 8.24508 20.3021 9.18234 19.3648L12.5765 15.9707C13.0451 15.5021 13.8049 15.5021 14.2735 15.9707C14.7421 16.4393 14.7421 17.1991 14.2735 17.6678L10.8794 21.0619C9.00488 22.9364 5.96569 22.9364 4.09117 21.0619L2.39411 19.3648C0.519596 17.4903 0.519596 14.4511 2.39411 12.5766L5.78823 9.18248C6.25685 8.71385 7.01665 8.71385 7.48528 9.18248C7.95391 9.65111 7.95391 10.4109 7.48528 10.8795L4.09117 14.2736ZM9.18234 7.48542C8.71371 7.01679 8.71371 6.257 9.18234 5.78837L12.5765 2.39425C14.451 0.519736 17.4902 0.519737 19.3647 2.39425L21.0617 4.09131C22.9362 5.96583 22.9362 9.00502 21.0617 10.8795L17.6676 14.2736C17.199 14.7423 16.4392 14.7423 15.9706 14.2736C15.5019 13.805 15.5019 13.0452 15.9706 12.5766L19.3647 9.18248C20.3019 8.24522 20.3019 6.72562 19.3647 5.78837L17.6676 4.09131C16.7304 3.15405 15.2108 3.15405 14.2735 4.09131L10.8794 7.48542C10.4108 7.95405 9.65097 7.95405 9.18234 7.48542ZM8.33381 15.1222C7.86518 14.6535 7.86518 13.8937 8.33381 13.4251L13.425 8.33395C13.8936 7.86532 14.6534 7.86532 15.122 8.33395C15.5907 8.80258 15.5907 9.56238 15.122 10.031L10.0309 15.1222C9.56224 15.5908 8.80244 15.5908 8.33381 15.1222Z"
                  fill="#5D8B2F"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <label className="upload-file cr-p">
            <input
              type="file"
              className="d-none"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => attachFile(e)}
            />
            <div className="d-flex justify-content-center align-items-center h-100 w-100 gap-2">
              <UploadIcon />
              <p className="font-16 font-weight-500">
                {file === null ? "Choose File / Drag & Drop Here" : file}
              </p>
            </div>
          </label>
        </div>
        <p>If you do not upload an image we will upload an image for you.</p>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-5">
          <button
            className="green-btn-outline custom-w min-width-208"
            onClick={() => goBack()}
          >
            Back
          </button>
          <button className="green-btn custom-w min-width-208">Next</button>
        </div>
      </form>
      <p className="text-center text-grey mt-5 font-16">
        Terms of use | Privacy Policy
      </p>
    </div>
  );
};

export default CannabisLounge;
