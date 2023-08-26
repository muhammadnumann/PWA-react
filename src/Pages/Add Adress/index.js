import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-phone-number-input/style.css";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { useRef } from "react";
import { PostAddress } from "../../Api";
import { useEffect } from "react";

const libraries = ["places"];
const AddAddressPage = () => {
  const [address, setAddress] = useState({
    address: JSON.parse(localStorage.getItem("signupData"))?.address || "",
    postalCode:
      JSON.parse(localStorage.getItem("signupData"))?.postalCode || "",
    phone: JSON.parse(localStorage.getItem("signupData"))?.phone || "",
  });
  const [userData, setuserData] = useState();

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setuserData(JSON.parse(currentUser));
  }, []);

  const addressUrl = `${process.env.REACT_APP_API_URI}users/updateUser/${userData?._id}`;
  const submitHandler = (e) => {
    e.preventDefault();
    PostAddress(addressUrl, address, navigate);
  };

  const inputRef = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setAddress((prevState) => ({
        ...prevState,
        address: place.formatted_address,
      }));
    }
  };

  return (
    <div className="max-width-792">
      <h2 className="auth-model-heading text-center mb-4">
        Enter your address to find nearby swaps
      </h2>
      <p className="auth-model-desc mb-4 pb-3">
        Provide your address to set your discovery range
      </p>

      <form onSubmit={(e) => submitHandler(e)}>
        <div className="mb-5">
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
                  Address
                </label>
                <input
                  type="text"
                  required
                  className="auth-input"
                  placeholder="Enter Address"
                />
              </div>
            </StandaloneSearchBox>
          </LoadScript>
          <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Postal Code
            </label>
            <input
              type="text"
              required
              className="auth-input"
              placeholder="Enter Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress((prevState) => ({
                  ...prevState,
                  postalCode: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Phone number [Used to verify your profile] (optional)
            </label>

            <div className="custom-phone-input auth-input d-flex align-items-center">
              <PhoneInput
                countrySelectProps={{ unicodeFlags: false }}
                placeholder="Enter Phone Number"
                onChange={(value) =>
                  setAddress((prevState) => ({
                    ...prevState,
                    phone: value,
                  }))
                }
                inputProps={{
                  name: "phone",
                }}
                buttonClass="d-none"
                inputClass="bg-transparent outline-0 p-0 m-0 border-0 shadow-none custom-phone-input-1 font-18-100"
              />
            </div>
          </div>
        </div>

        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-5">
          <button
            className="green-btn-outline custom-w min-width-208 back-btn"
            onClick={() => goBack()}
            type="button"
          >
            Back
          </button>
          <button
            className="green-btn custom-w min-width-208 next-btn"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
      <p className="text-center text-grey mt-5 font-16">
        Terms of use | Privacy Policy
      </p>
    </div>
  );
};

export default AddAddressPage;
