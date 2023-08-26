import React, { useState } from "react";
import Add1 from "../../assets/Images/match/Add1";
import UploadIcon from "../../assets/Images/Upload";

import { useEffect } from "react";
import { PostGrowndepotform } from "../../Api";

const Growndepot = ({ addNewhandler }) => {
  const [file, setFile] = useState(null);
  const [arrayData, setArrayData] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [growndepot, setGrowndepot] = useState({
    productType: "",
    name: "",
    price: "",
    description: "",
    photo: "",
  });
  const [id, setId] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    const parsedUser = JSON.parse(currentUser);
    setGrowndepot((prevState) => ({
      ...prevState,
      userId: parsedUser._id,
    }));
    setId(parsedUser._id);

    const savedData = JSON.parse(localStorage.getItem("growndepotdata"));
    if (savedData && Array.isArray(savedData)) {
      setArrayData(savedData);
    }
  }, []);
  useEffect(() => {
    const { productType, name, price, description } = growndepot;
    if (productType && name && price && description) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [growndepot]);

  useEffect(() => {
    localStorage.setItem("growndepotdata", JSON.stringify(arrayData));
  }, [arrayData]);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setGrowndepot((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setGrowndepot((prevState) => ({
        ...prevState,
        photo: Array.from(e.target.files),
      }));
      setFile(imageFile?.name);
    }
    const files = Array.from(e.target.files);
  };

  const clearForm = () => {
    console.log("Clearing the form");
    setGrowndepot({
      productType: "",
      name: "",
      price: "",
      description: "",
      photo: "",
    });
    setFile(null);
    setIsFormValid(false);
  };
  const addMore = () => {
    setArrayData((prev) => [...prev, growndepot]);
    clearForm();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedArrayData = [...arrayData, growndepot];
    let data = new FormData();
    updatedArrayData.forEach((mapData, index) => {
      data.append("userId", id);
      data.append("productType", mapData.productType);
      data.append("name", mapData.name);
      data.append("price", mapData.price);
      data.append("description", mapData.description);
      if (Array.isArray(mapData.photo)) {
        mapData.photo.forEach((file) => data.append(`photo-${index}`, file));
      } else {
        data.append(`photo-${index}`, mapData.photo);
      }
    });
    await PostGrowndepotform(data);
    clearForm();
    addNewhandler();
    setArrayData([]);
    localStorage.removeItem("growndepotdata");
  };

  return (
    <>
      <h3 className="font-32 font-weight-600 allproduct-heading mb-2">
        Post an Accessory
      </h3>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-3">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Product Type
            </label>
            <input
              type="text"
              className="auth-inputs"
              placeholder="Enter Product Type"
              name="productType"
              required
              onChange={(e) => formHandler(e)}
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Product Name
            </label>
            <input
              type="text"
              className="auth-inputs"
              placeholder="Enter Product Name"
              name="name"
              required
              onChange={(e) => formHandler(e)}
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Product Price
            </label>
            <input
              name="price"
              type="number"
              className="auth-inputs"
              required
              placeholder="$ Enter Product Price"
              onChange={(e) => formHandler(e)}
            />
          </div>
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-1">
          <label className="text-Black mb-1 font-weight-600 font-18-100">
            Product Description
          </label>
          <textarea
            onChange={(e) => formHandler(e)}
            className="auth-inputs-textarea"
            placeholder="Enter Product description here..."
            required
            name="description"
            value={growndepot.description}
          />
        </div>
        <label className="text-black mb-2 font-weight-600 font-18-100">
          Upload Images
        </label>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <label className="upload-files cr-p">
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
          <button
            className="add-mores bg-transparent border-white text-black gap-2"
            type="button"
            onClick={() => addMore()}
            disabled={!isFormValid}
          >
            <Add1 />
            Add More Accessories
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-end  mt-4">
          <button
            className="green-btn-outlines custom-w min-width-208"
            type="button"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            className={`green-btn custom-w min-width-208 ${
              isFormValid ? "enabled-button" : "disabled-button"
            }`}
            type="submit"
            data-bs-dismiss="modal"
            disabled={!isFormValid}
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
};

export default Growndepot;
  