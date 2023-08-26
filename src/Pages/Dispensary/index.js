import React, { useEffect, useState } from "react";
import UploadIcon from "../../assets/Images/Upload";
import AddIcon from "../../assets/Images/Add";
import { useNavigate } from "react-router-dom";
import { PostDispensary } from "../../Api";

const DispensaryType = () => {
  const [file, setFile] = useState(null);
  const [setAddMoreBtn] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [id, setId] = useState();
  const [dispensary, setDispensary] = useState({
    postStrain: JSON.parse(localStorage.getItem('signupData'))?.postStrain || "",
    quantity: JSON.parse(localStorage.getItem('signupData'))?.quantity || "",
    cost: JSON.parse(localStorage.getItem('signupData'))?.cost || "",
    strainName: JSON.parse(localStorage.getItem('signupData'))?.strainName || "",
    description: JSON.parse(localStorage.getItem('signupData'))?.description || "",
    photo: "",
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setDispensary((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)?._id,
    }));
    setId(JSON.parse(currentUser)?._id);
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
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log(arrayData);
  }, [arrayData]);

  const addMore = () => {
    setAddMoreBtn(true);
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
    const dataSignup = localStorage.getItem('signupData') && JSON.parse(localStorage.getItem('signupData'));
    const formatedData = {
      postStrain: dispensary.postStrain,
      quantity: dispensary.quantity,
      cost: dispensary.cost,
      strainName: dispensary.strainName,
      description: dispensary.description,
    }

    const finalData = {
      ...dataSignup,
      ...formatedData
    }

    localStorage.setItem('signupData', JSON.stringify(finalData));
    let data = new FormData();
    updatedArrayData.forEach((mapData, index) => {
      data.append("userId", id);
      data.append("postStrain", mapData.postStrain);
      data.append("quantity", mapData.quantity);
      data.append("cost", mapData.cost);
      data.append("strainName", mapData.strainName);
      data.append("description", mapData.description);

      if (Array.isArray(mapData.photo)) {
        mapData.photo.forEach((file) => data.append(`photo-${index}`, file));
      } else {
        data.append(`photo-${index}`, mapData.photo);
      }
    });
    PostDispensary(data, navigate);

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
    setAddMoreBtn(false);
    clearSavedData();
  };

  return (


    <div className="max-width-792">
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Post Strain
            </label>
            <select
              className="auth-input"
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
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Quantity
            </label>
            <select
              className="auth-input"
              required
              value={dispensary.quantity}
              name="quantity"
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-5"}>1-5 Grams</option>
              <option value={"5-10"}>5-10 Grams</option>
              <option value={"10-15"}>10-15 Grams</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Cost
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="number"
              className="auth-input"
              placeholder="$ Enter Cost"
              required
              value={dispensary.cost}
              name="cost"
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Strain Name
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="text"
              className="auth-input"
              placeholder="Enter Strain Name"
              required
              value={dispensary.strainName}
              name="strainName"
            />
          </div>
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
          <label className="text-white mb-2 font-weight-600 font-18-100">
            Description
          </label>
          <textarea
            onChange={(e) => formHandler(e)}
            className="auth-input-textarea"
            placeholder="Enter description here..."
            required
            name="description"
            value={dispensary.description}
          />
        </div>

        <label className="text-white mb-2 font-weight-600 font-18-100">
          Upload Images
        </label>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <label className="upload-file cr-p">
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
            className="add-more bg-transparent border-white text-white gap-2"
            onClick={() => addMore()}
            type="button"
          >
            <AddIcon />
            Add More Strain
          </button>
        </div>
        <p>If you do not upload an image we will upload an image for you.</p>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-5">
          <button
            className="green-btn-outline custom-w min-width-208"
            onClick={() => goBack()}
            type="button"
          >
            Back
          </button>
          <button className="green-btn custom-w min-width-208" type="submit">
            Next
          </button>
        </div>
      </form>
      <p className="text-center text-grey mt-5">
        Terms of use | Privacy Policy
      </p>
    </div>
  );
};

export default DispensaryType;
