import React, { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import CalendarIcon from "../../assets/Images/Calendar";
import { useNavigate } from "react-router-dom";
import { PostCannabisform } from "../../Api";
import UploadIcon from "../../assets/Images/Upload";
import Add1 from "../../assets/Images/match/Add1";

const CannbisFrom = ({ addNewhandler }) => {
  const [file, setFile] = useState(null);
  const [arrayData, setArrayData] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [cannabis, setCannabis] = useState({
    event: "",
    accessories: "",
    entryFee: "",
    userId: "",
    photo: "",
    description: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    setCannabis((prevState) => ({
      ...prevState,
      date: value,
    }));
  }, [value]);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    const parsedUser = JSON.parse(currentUser);
    setCannabis((prevState) => ({
      ...prevState,
      userId: parsedUser._id,
    }));
    setId(parsedUser._id);

    const savedData = JSON.parse(localStorage.getItem("cannabisData"));
    if (savedData && Array.isArray(savedData)) {
      setArrayData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cannabisData", JSON.stringify(arrayData));
  }, [arrayData]);

  const goBack = () => {
    navigate(-1);
  };

  const clearForm = () => {
    setCannabis({
      event: "",
      accessories: "",
      entryFee: "",
      userId: "",
      photo: "",
      description: "",
    });
    setFile(null);
  };

  useEffect(() => {
    const { event, accessories, entryFee, description } = cannabis;
    if (event && accessories && entryFee && description) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [cannabis]);

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

  const addMore = () => {
    setArrayData((prev) => [...prev, cannabis]);
    clearForm();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedArrayData = [...arrayData, cannabis];
    const data = new FormData();
    updatedArrayData.forEach((mapData, index) => {
      data.append("event", mapData.event);
      data.append("accessories", mapData.accessories);
      data.append("description", mapData.description);
      data.append("entryFee", mapData.entryFee);
      data.append("userId", id);
      if (Array.isArray(mapData.photo)) {
        mapData.photo.forEach((file) => data.append(`photo-${index}`, file));
      } else {
        data.append(`photo-${index}`, mapData.photo);
      }
    });
    await PostCannabisform(data);
    clearForm();
    addNewhandler();
    setArrayData([]);
    localStorage.removeItem("cannabisData");
  };

  return (
    <>
      <h3 className="font-32 font-weight-600 allproduct-heading mb-2">
        Post an Entry Fee{" "}
      </h3>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-4">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Lounge Accessories provider for Use
            </label>
            <select
              className="auth-inputs"
              name="accessories"
              onChange={(e) => formHandler(e)}
              required
            >
              <option value="">- Select Option -</option>
              <option value="Bongs">Bongs</option>
              <option value="Rig">Rig</option>
              <option value="Papers">Papers</option>
              <option value="Vaporizers">Vaporizers</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Events
            </label>
            <select
              className="auth-inputs"
              name="event"
              onChange={(e) => formHandler(e)}
              required
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
            <label className="text-Black mb-2 font-weight-600 font-18-100">
              Entry Cost
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="number"
              className="auth-inputs"
              placeholder="$ 00"
              name="entryFee"
            />
          </div>
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
            value={cannabis.description}
          />
        </div>
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
            className="add-mores bg-transparent border-white text-Black gap-2"
            onClick={() => addMore()}
            disabled={!isFormValid} 
            type="button"
          >
            <Add1 />
            Add More Entry Fee
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
            className={`green-btn custom-w min-width-208 ${isFormValid ? "enabled-button" : "disabled-button"
              }`}
            data-bs-dismiss="modal"
            disabled={!isFormValid}
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
};

export default CannbisFrom;
