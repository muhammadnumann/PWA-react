import React, { useEffect, useState } from "react";
import UploadIcon from "../../assets/Images/Upload";
import Add1 from "../../assets/Images/match/Add1";
import { useNavigate } from "react-router-dom";
import { PostDispensaryform } from "../../Api";
import Select from "react-select";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";

const DispensaryFrom = ({ addNewhandler }) => {
  const [file, setFile] = useState(null);
  const [arrayData, setArrayData] = useState([]);
  const [id, setId] = useState();
  const [dispensary, setDispensary] = useState({
    postStrain: "",
    quantity: "",
    cost: "",
    productName: "",
    description: "",
    photo: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);

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

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setDispensary((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)._id,
    }));
    setId(JSON.parse(currentUser)._id);
  }, []);

  const formHandler = (e) => {
    const { name, value } = e.target;
    console.log(dispensary);
    setDispensary((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearSavedData = () => {
    localStorage.setItem("savedDataCount", "0");
  };
  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setDispensary((prevState) => ({
        ...prevState,
        photo: Array.from(e.target.files),
      }));
      setFile(imageFile?.name);
    }
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log(arrayData);
  }, [arrayData]);

  const addMore = () => {
    setArrayData((prev) => [...prev, dispensary]);
    setDispensary({
      postStrain: "",
      quantity: "",
      cost: "",
      strainName: "",
      description: "",
      photo: "",
    });
    setFile(null);
    const savedDataCount =
      JSON.parse(localStorage.getItem("savedDataCount")) || 0;
    localStorage.setItem("savedDataCount", JSON.stringify(savedDataCount + 1));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const updatedArrayData = [...arrayData, dispensary];
    let data = new FormData();
    updatedArrayData.forEach((mapData, index) => {
      data.append("userId", id);
      data.append("postStrain", mapData.postStrain);
      data.append("quantity", mapData.quantity);
      data.append("cost", mapData.cost);
      data.append("productName", mapData.productName);
      data.append("description", mapData.description);

      if (Array.isArray(mapData.photo)) {
        mapData.photo.forEach((file) => data.append(`photo-${index}`, file));
      } else {
        data.append(`photo-${index}`, mapData.photo);
      }
    });
    PostDispensaryform(data, addNewhandler);
    addNewhandler();
    setDispensary({
      postStrain: "",
      quantity: "",
      cost: "",
      strainName: "",
      description: "",
      photo: "",
    });

    setFile(null);
    setArrayData([]);
    clearSavedData();
  };
  const [response, setResponse] = useState({
    userId: "",
    strainType: "",
    grownType: "",
    photo: "",
    strainName: "",
    description: "",
    quantity: "",
  });
  const [allStrains, setAllStrains] = useState();
  const allStrainsData = (allStrains || []).map((strain) => ({
    value: strain?._id,
    label: strain?.strainName || strain?.productName || strain?.event,
  }));
  const [value, setValue] = useState("");
  const StrainTypeHandler = (data) => {
    setValue(data);
    const matchedObject = allStrains.find((obj) => obj?._id === data.value);
    setDispensary((prevState) => ({
      ...prevState,
      productName: matchedObject?.productName,
      description: matchedObject?.description,
    }));
  };
  const isFormValid = () => {
    return (
      dispensary.postStrain !== "" &&
      dispensary.quantity !== "" &&
      dispensary.cost !== "" &&
      dispensary.productName !== "" &&
      dispensary.description !== ""
    );
  };
  return (
    <>
      <h3 className="font-32 font-weight-600 allproduct-heading mb-2">
        Post a Strain
      </h3>
      <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-1">
        <div className="form-control h-auto p-0 bg-transparent border-0">
          <label className="text-Black mb-2 font-weight-600 font-18-100">
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
            placeholder="Select an item"
          />
        </div>
      </div>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-2">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Name
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="text"
              className="auth-inputs"
              placeholder="Enter Name"
              required
              value={dispensary.productName}
              name="productName"
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Strain
            </label>
            <select
              className="auth-inputs"
              required
              name="postStrain"
              defaultValue={dispensary.postStrain}
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Strain -</option>
              <option value="Sativa">Sativa</option>
              <option value="Indica">Indica</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CBD">CBD</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-2">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Quantity
            </label>
            <select
              className="auth-inputs"
              required
              defaultValue={dispensary.quantity}
              name="quantity"
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-7"}>1-7 Grams</option>
              <option value={"7-14"}>7-14 Grams</option>
              <option value={"14-30"}>14-30 Grams</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Price
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="number"
              className="auth-inputs"
              placeholder="$ Enter Price"
              required
              value={dispensary.cost}
              name="cost"
            />
          </div>{" "}
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-1">
          <label className="text-Black mb-1 font-weight-600 font-18-100">
            Description
          </label>
          <textarea
            onChange={(e) => formHandler(e)}
            className="auth-inputs-textarea"
            placeholder="Enter description here..."
            required
            name="description"
            value={dispensary.description}
          />
        </div>

        <label className="text-Black mb-2 font-weight-600 font-18-100">
          Upload Images
        </label>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-2">
          <label className="upload-files cr-p">
            <input
              type="file"
              className="d-none"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={(e) => attachFile(e)}
            />

            <div className="d-flex justify-content-center align-items-center h-100 w-100 gap-2">
              <UploadIcon />
              <p className="font-16 font-weight-500">
                {file === null ? "Choose File / Drag & Drop Here" : file}
              </p>
            </div>
          </label>
          <button
            className="add-mores bg-transparent border-white text-Black gap-2"
            onClick={() => addMore()}
            type="button"
            disabled={
              !dispensary.quantity ||
              !dispensary.cost ||
              !dispensary.productName ||
              !dispensary.description
            }
          >
            <Add1 />
            Add More Strains
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-end  mt-2">
          <button
            className="green-btn-outlines custom-w min-width-208"
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

export default DispensaryFrom;
