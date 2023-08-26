import React from "react";
import { useState } from "react";
import Axios from "../../axios/Axios";
import { useEffect } from "react";
import "../../Components/FilterForm/modelform.css";
import { useParams } from "react-router-dom";
import userprofile from "../../assets/Images/social-user.svg";

const MatchProfile = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState([]);
  const [currentuserData, setcurrentuserData] = useState();

  useEffect(() => {
    console.log("ID:", id);
    async function fetchData() {
      await Axios.get(`users/${id}`)
        .then((response) => {
          console.log(response);
          setUserData(response?.data?.data?.doc);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    console.log(data);
  }, []);

  function toPascalCase(string) {
    return `${string}`
      .toLowerCase()
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w*)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3}`
      )
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="row m-0">
          <div className="col-xl-3 pe-md-0 col-md-6 mb-md-0 pb-lg-0 mb-4 pb-3">
            <div className="seed-card flex-column">
              <div className="d-flex flex-lg-column justify-content-lg-center gap-4 justify-content-start align-items-lg-center mb-lg-5 mb-3">
                <img
                  src={
                    userData.photo
                      ? `${process.env.REACT_APP_PORT}/${userData?.socialPhotos[0]}`
                      : userprofile
                  }
                  alt=""
                  className="mb-md-4 user-profile-image"
                />
                <div className="mt-2">

                  {userData?.fullName && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                      <lable className="font-24 font-weight-800">Name:</lable>
                      <p className="font-22 font-weight-00">
                        {toPascalCase(userData?.fullName)}
                      </p>
                    </span>
                  )}
                  {userData?.age && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                      <lable className="font-24 font-weight-800">Age:</lable>
                      <p className="font-22 font-weight-00">{toPascalCase(userData?.age)}</p>
                    </span>
                  )}
                  {userData.gender && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                      <lable className="font-24 font-weight-800">Gender:</lable>
                      <p className="font-22 font-weight-00">
                        {toPascalCase(userData?.gender)}
                      </p>
                    </span>
                  )}
                  {userData.smoking && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                      <lable className="font-24 font-weight-800">
                        Smoking:
                      </lable>
                      <p className="font-22 font-weight-00">
                        {toPascalCase(userData?.smoking)}
                      </p>
                    </span>
                  )}
                  {userData.socialSetting && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                      <lable className="font-24 font-weight-800">
                        Socially:
                      </lable>
                      <p className="font-22 font-weight-00">
                        {toPascalCase(userData?.socialSetting[0])}
                      </p>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-md-6 ">
            <div className="align-items-center justify-content-start ">
              {currentuserData?.isPremium && (
                <>

                  {userData?.datingLifestyle && (
                    <div className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-3">
                      <lable className="font-24 font-weight-800">
                      Dating lifestyle:
                      </lable>
                      <p className="font-24 font-weight-00">
                        {toPascalCase(userData?.datingLifestyle)}
                      </p>
                    </div>
                  )}
                  {userData?.politicalBelief && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-3">
                      <lable className="font-24 font-weight-800">
                        Political Belief:
                      </lable>
                      <p className="font-24 font-weight-00">
                        {toPascalCase(userData?.politicalBelief)}
                      </p>
                    </span>
                  )}
                  {userData?.preferredStrain && (
                    <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-3">
                      <lable className="font-24 font-weight-800">
                        Preferred Strain:
                      </lable>
                      <p className="font-24 font-weight-00">
                        {toPascalCase(userData?.preferredStrain)}
                      </p>
                    </span>
                  )}
                  
                  {userData.musicGenre && userData.musicGenre.length > 0 && (
                    <>
                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                        <p className="font-24 font-weight-800">Music Genre:</p>
                      </span>
                      <span className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        {(userData.musicGenre || []).map((data, index) => {
                          return (
                            <p className="font-weight-00 custom-info">{toPascalCase(data)}</p>
                          );
                        })}
                      </span>
                    </>
                  )}
                  {userData.consumptionMethod && userData.consumptionMethod.length > 0 && (
                    <>
                      <span className="d-flex gap-2 align-items-center font-18 font-weight-500 pb-2">
                        <h1 className="font-24 font-weight-800">
                          Consumption Method:
                        </h1>
                      </span>
                      <span className="d-flex flex-wrap align-items-center gap-2">
                        {(userData.consumptionMethod || []).map(
                          (data, index) => {
                            return (
                              <p className=" font-weight-00  custom-info">
                                {toPascalCase(data)}
                              </p>
                            );
                          }
                        )}
                      </span>
                    </>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchProfile;
