import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostRetailerType } from "../../Api";

const RetailerType = () => {
  const [retailerType, setRetailerType] = useState({
    retailerType:
      JSON.parse(localStorage.getItem("signupData"))?.retailerType || "",
  });
  const [userData, setuserData] = useState();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const formHandler = (e) => {
    const { name, value } = e.target;
    setRetailerType((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setuserData(JSON.parse(currentUser));
  }, []);

  const RetailerTypeUrl = `${process.env.REACT_APP_API_URI}users/updateUser/${userData?._id}`;
  const submitHandler = (e) => {
    e.preventDefault();
    PostRetailerType(RetailerTypeUrl, retailerType, navigate);
  };
  return (
    <div className="max-width-521">
      <h2 className="auth-model-heading mb-4 pb-3">
        What type of Retailer are you?
      </h2>
      <form onSubmit={(e) => submitHandler(e)}>
        <select
          className="auth-input"
          required
          onChange={(e) => formHandler(e)}
          name="retailerType"
          defaultValue={retailerType.retailerType}
        >
          <option value="">- Select Retailer Type -</option>
          <option value="dispensary">Dispensary</option>
          <option value="headshop">HeadShop</option>
          <option value="growdepot">Grow Depot</option>
          <option value="cannabis">Cannabis Lounge</option>
          <option value="seedbank">Seed Bank</option>
        </select>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-between  mt-4 pt-3">
          <button
            className="green-btn-outline"
            onClick={() => goBack()}
            type="button"
          >
            Back
          </button>
          <button className="green-btn" type="submit">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetailerType;
