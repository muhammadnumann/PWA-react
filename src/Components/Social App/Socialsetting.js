/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productuser from "../../assets/Images/productuser-1.svg";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-phone-number-input/style.css";
import { useEffect } from "react";
import { EditUser } from "../../Api";
import { useRef } from "react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries = ["places"];
const SocialSetting = () => {
  const [editedData, setEditedData] = useState({
    address: "",
    fullName: "",
    userName: "",
    phone: "",
    social_photos: [],
  });
  const [userData, setuserData] = useState();

  const navigate = useNavigate();

  const [file, setFile] = useState([productuser]);
  const location = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    const data = JSON.parse(currentUser);
    setEditedData({
      address: data?.location?.address,
      fullName: data?.fullName,
      userName: data?.userName,
      phone: data?.location.phone,
      social_photos: "",
    });
    setuserData(JSON.parse(currentUser));
    data.social_photos &&
      setFile(`${process.env.REACT_APP_PORT}/${data?.social_photos}`);
  }, []);

  const EditProfileUrl = `${process.env.REACT_APP_API_URI}users/profileUpdate/${userData?._id}`;

  // const attachFile = (e) => {
  //   if (e.target.files) {
  //     let imageFiles = Array.from(e.target.files);
  //     setEditedData((prevState) => ({
  //       ...prevState,
  //       social_photos: imageFiles,
  //     }));

  //     const imagesPreview = imageFiles.map((file) => URL.createObjectURL(file));
  //     setFile(imagesPreview);
  //   }
  // };
  const [imageSelectionError, setImageSelectionError] = useState("");
  // const attachFile = (e) => {
  //   if (e.target.files) {
  //     let imageFiles = Array.from(e.target.files);

  //     if (imageFiles.length >= 1 && imageFiles.length <= 3) {
  //       setEditedData((prevState) => ({
  //         ...prevState,
  //         social_photos: imageFiles,
  //       }));

  //       const imagesPreview = imageFiles.map((file) =>
  //         URL.createObjectURL(file)
  //       );
  //       setFile(imagesPreview);
  //     } else {
  //       console.log("Please select 1 to 3 images.");
  //     }
  //   }
  // };
  const attachFile = (e) => {
    if (e.target.files) {
      let imageFiles = Array.from(e.target.files);

      if (imageFiles.length >= 1 && imageFiles.length <= 3) {
        setEditedData((prevState) => ({
          ...prevState,
          social_photos: imageFiles,
        }));

        const imagesPreview = imageFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setFile(imagesPreview);
        setImageSelectionError("");
      } else {
        setImageSelectionError("Please select 1 to 3 images.");
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    let allowEdit = false;
    if (editedData.fullName) {
      data.append("fullName", editedData.fullName);
      allowEdit = true;
    }
    if (editedData.userName) {
      data.append("userName", editedData.userName);
      allowEdit = true;
    }
    if (editedData.phone) {
      data.append("phone", editedData.phone);
      allowEdit = true;
    }
    if (editedData.social_photos.length > 0) {
      editedData.social_photos.forEach((imageFile, index) => {
        data.append(`social_photos`, imageFile);
      });
    }
    if (editedData.address) {
      data.append("address", editedData.address);
      allowEdit = true;
    }
    if (allowEdit) {
      EditUser(EditProfileUrl, data, navigate, location);
    }
  };

  const inputRef = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setEditedData((prevState) => ({
        ...prevState,
        address: place.formatted_address,
      }));
    }
  };
  console.log(userData);

  return (
    <div className="my-4">
      <div className="container mx-auto">
        <div className="me-12 ms-12 position-relative">
          <div className=" mx-auto edit-profile">
            <form onSubmit={(e) => submitHandler(e)}>
              <div className="self-summary text-white mb-5 p-3 d-flex flex-column align-items-center gap-4 position-relative">
                {file.length > 0 &&
                  file.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Uploaded Image ${index}`}
                      className={`mb-md-4 user-profile-image ${
                        index === selectedImageIndex ? "selected" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                {imageSelectionError && (
                  <p className="text-danger">{imageSelectionError}</p>
                )}

                <label className="text-white green-btn-outline text-primary-green w-max-content px-3 cr-p d-flex justify-content-center align-items-center">
                  <input
                    type="file"
                    className="d-none"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={(e) => attachFile(e)}
                  />
                  <span>Upload Picture</span>
                </label>
                <p className="text-danger">
                  For best results: Upload a minimum of 3 pictures
                </p>
              </div>

              <div className="d-sm-none d-block mt-4">
                <div className="bg-transparent border-0 mb-4 w-100">
                  <label className="text-white mb-2 font-weight-600 font-18-100">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editedData.fullName}
                    className="auth-input"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={(e) =>
                      setEditedData((prevState) => ({
                        ...prevState,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="bg-transparent border-0 mb-4 w-100 mb-sm-5 mb-3">
                  <label className="text-white mb-2 font-weight-600 font-18-100">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={editedData.userName}
                    className="auth-input"
                    placeholder="User Name"
                    name="userName"
                    onChange={(e) =>
                      setEditedData((prevState) => ({
                        ...prevState,
                        userName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-100">
                  <label className="text-white mb-2 font-weight-600 font-18-100">
                    Phone Number
                  </label>
                  <div className="custom-phone-input auth-input d-flex align-items-center mb-4 w-100">
                    <PhoneInput
                      countrySelectProps={{ unicodeFlags: false }}
                      onChange={(value) =>
                        setEditedData((prevState) => ({
                          ...prevState,
                          phone: value,
                        }))
                      }
                      inputProps={{
                        name: "phone",
                      }}
                      value={editedData.phone}
                      buttonClass="d-none"
                      inputClass="bg-transparent outline-0 p-0 m-0 border-0 shadow-none custom-phone-input-1 font-18-100"
                    />
                  </div>
                </div>
                <LoadScript
                  googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP}
                  libraries={libraries}
                >
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRef.current = ref)}
                    onPlacesChanged={handlePlaceChanged}
                  >
                    <div className="form-control h-auto p-0 bg-transparent mt-4 border-0 mb-4">
                      <label className="text-white mb-2 font-weight-600 font-18-100">
                        Address
                      </label>
                      <input
                        value={editedData.address}
                        type="text"
                        className="auth-input"
                        placeholder="Enter Address"
                        onChange={(e) =>
                          setEditedData((prevState) => ({
                            ...prevState,
                            address: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </StandaloneSearchBox>
                </LoadScript>
                <button
                  className="green-btn w-100 ps-3 font-18-social pe-1 d-flex align-items-center justify-content-center user"
                  type="submit"
                >
                  Save Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSetting;
