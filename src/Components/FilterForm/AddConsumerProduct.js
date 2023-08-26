import React, { useState } from "react";
import UploadIcon from "../../assets/Images/Upload";
import { useNavigate } from "react-router-dom";
import AddIcon from "../../assets/Images/Add";
import { useEffect } from "react";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import Select from "react-select";

const AddConsumerProduct = (props) => {
  const { setApiResponse } = props;
  const [myArray, setMyArray] = useState([]);
  const [addMorebtn, setAddMoreBtn] = useState(false);
  const [id, setId] = useState();
  const [file, setFile] = useState(null);
  const [allStrains, setAllStrains] = useState();
  const [response, setResponse] = useState({
    userId: "",
    strainType: "",
    grownType: "",
    photo: "",
    strainName: "",
    description: "",
    quantity: "",
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setResponse((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)?._id,
    }));
    setId(JSON.parse(currentUser)?._id);
    GetAllStrains();
  }, []);

  const GetAllStrains = async () => {
    try {
      const fetchData = await Axios.get(
        `${process.env.REACT_APP_API_URI}users/getAllStrains`
      );
      setAllStrains(fetchData.data.result);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setResponse((prevState) => ({
        ...prevState,
        photo: Array.from(e.target.files),
      }));
      setFile(imageFile?.name);
    }
  };

  const formHandler = (e) => {
    const { name, value } = e.target;
    setResponse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const clearSavedData = () => {
    localStorage.setItem("savedDataCount", "0");
  };

  const PostResponseUrl = `${process.env.REACT_APP_API_URI}userItem`;

  const PostResponse = async (newArray) => {
    try {
      await Axios.post(PostResponseUrl, newArray);
      toast.success("Strain Added Successfully");
      setApiResponse(true);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const dataSignup =
      localStorage.getItem("signupData") &&
      JSON.parse(localStorage.getItem("signupData"));
    const formatedData = {
      userId: response.userId,
      strainType: response.strainType,
      grownType: response.cost,
      strainName: response.strainName,
      description: response.description,
      quantity: response.quantity,
    };

    const finalData = {
      ...dataSignup,
      ...formatedData,
    };

    localStorage.setItem("signupData", JSON.stringify(finalData));

    const data = new FormData();

    if (addMorebtn) {
      const updatedArray = [...myArray, response];
      setMyArray(updatedArray);

      updatedArray.forEach((mapData, index) => {
        console.log(mapData);
        data.append("userId", id);
        data.append("strainType", mapData.strainType);
        data.append("grownType", mapData.grownType);
        data.append("description", mapData.description);
        data.append("strainName", mapData.strainName);
        data.append("quantity", mapData.quantity);

        if (Array.isArray(mapData.photo)) {
          mapData.photo.forEach((file, fileIndex) =>
            data.append(`photo-${index}-${fileIndex}`, file)
          );
        } else {
          data.append(`photo-${index}`, mapData.photo);
        }
      });
    } else {
      data.append("userId", id);
      data.append("strainType", response.strainType);
      data.append("grownType", response.grownType);
      data.append("description", response.description);
      data.append("strainName", response.strainName);
      data.append("quantity", response.quantity);

      if (Array.isArray(response.photo)) {
        response.photo.forEach((file, fileIndex) =>
          data.append(`photo-${fileIndex}`, file)
        );
      } else {
        data.append("photo", response.photo);
      }
    }

    PostResponse(data, navigate);
    clearSavedData();
  };

  const addMore = () => {
    setAddMoreBtn(true);
    setMyArray((prev) => [...prev, response]);
    setResponse({
      strainType: "",
      grownType: "",
      photo: "",
    });
    setFile(null);
    const savedDataCount =
      JSON.parse(localStorage.getItem("savedDataCount")) || 0;
    localStorage.setItem("savedDataCount", JSON.stringify(savedDataCount + 1));
  };

  const allStrainsData = (allStrains || []).map((strain) => ({
    value: strain?._id,
    label: strain?.strainName || strain?.productName || strain?.event,
  }));

  const [value, setValue] = useState("");
  const StrainTypeHandler = (data) => {
    console.log(data);
    setValue(data);
    const matchedObject = allStrains.find((obj) => obj?._id === data.value);
    console.log(matchedObject);
    setResponse((prevState) => ({
      ...prevState,
      strainName: matchedObject?.strainName || matchedObject?.productName,
      description: matchedObject?.description,
      strainType: matchedObject?.postStrain ? matchedObject?.postStrain : "",
    }));
  };
  const isFormValid = () => {
    return (
      response.userId !== "" &&
      response.strainType !== "" &&
      response.grownType !== "" &&
      response.photo !== "" &&
      response.strainName !== "" &&
      response.description !== "" &&
      response.quantity !== ""
    );
  };
  return (
    <>
      <h2 className="auth-model-heading mb-4 pb-3">
        We’ll help you get started based on your response
      </h2>
      <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
        <div className="form-control h-auto p-0 bg-transparent border-0">
          <label className=" mb-2 font-weight-600 font-18-100">
            Select Strain
          </label>
          <Select
            onChange={StrainTypeHandler}
            value={value}
            className="searchable-select"
            classNamePrefix="select"
            isDisabled={false}
            isLoading={false}
            isClearable={false}
            isRtl={false}
            isSearchable={true}
            name="color"
            options={allStrainsData}
          />
        </div>
      </div>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-start gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className=" mb-2 font-weight-600 font-18-100">Name</label>
            <input
              onChange={(e) => formHandler(e)}
              type="text"
              className="auth-input bg-white"
              placeholder="Enter Name"
              required
              value={response.strainName}
              name="strainName"
            />
            <span className="font-12 ">
              If you can’t find your strain in the dropdown menu, write it here
            </span>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className=" mb-2 font-weight-600 font-18-100">
              Which Strain type do you have?
            </label>
            <select
              className="auth-input bg-white"
              required
              name="strainType"
              onChange={(e) => formHandler(e)}
              defaultValue={response.strainType}
            >
              <option value={""}>Strain Type</option>
              <option value={"Sativa"}>Sativa</option>
              <option value={"Indica"}>Indica</option>
              <option value={"Hybrid"}>Hybrid</option>
              <option value={"CBD"}>CBD</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className=" mb-2 font-weight-600 font-18-100">
              Quantity Available for Sharing
            </label>
            <select
              className="auth-input bg-white"
              required
              name="quantity"
              onChange={(e) => formHandler(e)}
              defaultValue={response.quantity}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-4"}>1-4 Seeds</option>
              <option value={"5-10"}>5-10 Seeds</option>
              <option value={"11-15"}>11-15 Seeds</option>
              <option value={"16-20"}>16-20 Seeds</option>
            </select>
          </div>

          <div className="form-control h-auto p-0 bg-transparent border-0 ">
            <label className=" mb-2 font-weight-600 font-18-100">
              Grown or Purchased?
            </label>
            <select
              className="auth-input bg-white"
              required
              name="grownType"
              onChange={(e) => formHandler(e)}
              defaultValue={response.grownType}
            >
              <option value={""}>- Select Option -</option>
              <option value={"Dispensary"}>Dispensary</option>
              <option value={"Grown"}>Grown</option>
            </select>
          </div>
        </div>

        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <label className=" mb-2 font-weight-600 font-18-100">
            Description
          </label>
          <textarea
            onChange={(e) => formHandler(e)}
            className="auth-input-textarea bg-white"
            placeholder="Enter description here..."
            required
            name="description"
            value={response.description}
          />
        </div>
        <div className="d-flex flex-md-row flex-column align-items-end gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className=" mb-2 font-weight-600 font-18-100">
              Upload Images
            </label>
            <label className="upload-file cr-p w-100 ">
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
          <button
            className="add-more bg-transparent border-black text-black gap-2"
            onClick={() => addMore()}
            type="button"
          >
            <AddIcon />
            Add More
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-end  mt-2">
          <button
            className="green-btn-outlines custom-w min-width-208 height-56"
            type="button"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            className={`green-btn custom-w min-width-208 ${
              isFormValid() ? "enabled-button" : "disabled-button"
            }`}
            type="submit"
            data-bs-dismiss="modal"
            disabled={!isFormValid()}
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
};

export default AddConsumerProduct;
