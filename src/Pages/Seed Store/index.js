import React, { useEffect, useState } from "react";
import UploadIcon from "../../assets/Images/Upload";
import AddIcon from "../../assets/Images/Add";
import { useNavigate } from "react-router-dom";
import { PostSeedStore } from "../../Api";

const SeedStore = () => {
  const [file, setFile] = useState(null);
  const [arrayData, setArrayData] = useState([]);
  const [id, setId] = useState();
  const [seedStore, setSeedStore] = useState({
    postStrain: JSON.parse(localStorage.getItem('signupData'))?.postStrain || "",
    quantity: JSON.parse(localStorage.getItem('signupData'))?.quantity || "",
    cost: JSON.parse(localStorage.getItem('signupData'))?.cost || "",
    strainName: JSON.parse(localStorage.getItem('signupData'))?.strainName || "",
    description: JSON.parse(localStorage.getItem('signupData'))?.description || "",
    photo: "",
  });
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setSeedStore((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)?._id,
    }));
    setId(JSON.parse(currentUser)?._id);
  }, []);

  const formHandler = (e) => {
    const { name, value } = e.target;
    setSeedStore((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const attachFile = (e) => {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      setSeedStore((prevState) => ({
        ...prevState,
        photo: Array.from(e.target.files),
      }));
      setFile(imageFile?.name);
    }
  };
  const clearSavedData = () => {
    localStorage.setItem("savedDataCount", "0");
  };
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const addMore = () => {
    setArrayData((prev) => [...prev, seedStore]);
    setSeedStore({
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
    const updatedArrayData = [...arrayData, seedStore];

    const dataSignup = localStorage.getItem('signupData') && JSON.parse(localStorage.getItem('signupData'));
    const formatedData = {
      postStrain: seedStore.postStrain,
      quantity: seedStore.quantity,
      cost: seedStore.cost,
      strainName: seedStore.strainName,
      description: seedStore.description,
    }

    const finalData = {
      ...dataSignup,
      ...formatedData
    }

    localStorage.setItem('signupData', JSON.stringify(finalData));

    const data = new FormData();
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

    PostSeedStore(data, navigate);
    setSeedStore({
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
              defaultValue={seedStore.postStrain}
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
              defaultValue={seedStore.quantity}
              name="quantity"
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-5"}>1-5 </option>
              <option value={"4-10"}>5-10 </option>
              <option value={"10-15"}>10-15</option>
              <option value={"15-20"}>15-20</option>
              <option value={"20-30"}>20-30</option>
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
              value={seedStore.cost}
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
              value={seedStore.strainName}
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
            value={seedStore.description}
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
              onChange={(e) => attachFile(e)}
              multiple
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

export default SeedStore;
