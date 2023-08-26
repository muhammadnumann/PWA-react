import React, { useEffect, useState } from "react";
import UploadIcon from "../../assets/Images/Upload";
import Add1 from "../../assets/Images/match/Add1";
import { PostSeedStoreform } from "../../Api";
import Select from "react-select";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";

const SeedstoreForm = ({ addNewhandler }) => {
  const [file, setFile] = useState(null);
  const [addMorebtn, setAddMoreBtn] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [id, setId] = useState();
  const [seedStore, setSeedStore] = useState({
    postStrain: "",
    quantity: "",
    cost: "",
    productName: "",
    description: "",
    photo: "",
    purchased: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    setSeedStore((prevState) => ({
      ...prevState,
      userId: JSON.parse(currentUser)._id,
    }));
    setId(JSON.parse(currentUser)._id);
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
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const clearSavedData = () => {
    localStorage.setItem("savedDataCount", "0");
  };

  const addMore = () => {
    setAddMoreBtn(true);
    setArrayData((prev) => [...prev, seedStore]);
    setSeedStore({
      postStrain: "",
      quantity: "",
      cost: "",
      strainName: "",
      description: "",
      photo: "",
      purchased: "",
    });
    setFile(null);
    const savedDataCount =
      JSON.parse(localStorage.getItem("savedDataCount")) || 0;
    localStorage.setItem("savedDataCount", JSON.stringify(savedDataCount + 1));
  };

  const [allStrains, setAllStrains] = useState();
  const allStrainsData = (allStrains || []).map((strain) => ({
    value: strain?._id,
    label: strain?.strainName || strain?.productName || strain?.event,
  }));

  useEffect(() => {
    GetAllStrains();
  }, []);

  const GetAllStrains = async () => {
    try {
      const fetchData = await Axios.get(
        `${process.env.REACT_APP_API_URI}users/getAllStrains`
      );
      console.log(fetchData.data.result);
      setAllStrains(fetchData.data.result);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const [value, setValue] = useState("");
  const StrainTypeHandler = (data) => {
    setValue(data);
    const matchedObject = allStrains.find((obj) => obj?._id === data.value);
    setSeedStore((prevState) => ({
      ...prevState,
      productName:
        matchedObject?.productName || matchedObject?.accessories || "",
      description: matchedObject?.description,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const updatedArrayData = [...arrayData, seedStore];

    const data = new FormData();
    updatedArrayData.forEach((mapData, index) => {
      data.append("userId", id);
      data.append("postStrain", mapData.postStrain);
      data.append("quantity", mapData.quantity);
      data.append("cost", mapData.cost);
      data.append("productName", mapData.productName);
      data.append("description", mapData.description);
      data.append("purchased", mapData.purchased);

      if (Array.isArray(mapData.photo)) {
        mapData.photo.forEach((file) => data.append(`photo-${index}`, file));
      } else {
        data.append(`photo-${index}`, mapData.photo);
      }
    });

    PostSeedStoreform(data);
    setSeedStore({
      postStrain: "",
      quantity: "",
      cost: "",
      strainName: "",
      description: "",
      photo: "",
    });
    addNewhandler();
    setFile(null);
    setArrayData([]);
    clearSavedData();
  };
  const savedDataCount =
    JSON.parse(localStorage.getItem("savedDataCount")) || 0;
  return (
    <>
      <h3 className="font-32 font-weight-600 allproduct-heading mb-2">
        Post a Strain
      </h3>
      <div className="d-flex flex-md-row flex-column align-items-center gap-3 justify-content-between mb-2">
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
        <div className="d-flex flex-md-row flex-column align-items-center gap-3 justify-content-between mb-2">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Name
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="text"
              className="auth-inputs"
              placeholder="Enter Name"
              required
              value={seedStore.productName}
              name="productName"
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Strain
            </label>
            <select
              className="auth-inputs"
              required
              name="postStrain"
              value={seedStore.postStrain}
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
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Quantity
            </label>
            <select
              className="auth-inputs"
              required
              value={seedStore.quantity}
              name="quantity"
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Quantity -</option>
              <option value={"1-4"}>1-4 </option>
              <option value={"5-10"}>5-10 </option>
              <option value={"11-15"}>11-15</option>
              <option value={"16-20"}>16-20</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column align-items-center gap-3 justify-content-between mb-2">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100">
              Seed Price
            </label>
            <input
              onChange={(e) => formHandler(e)}
              type="number"
              className="auth-inputs"
              placeholder="$ Enter Seed Price"
              required
              value={seedStore.cost}
              name="cost"
            />
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-black mb-2 font-weight-600 font-18-100  mb-2">
              Grown or purchased?
            </label>
            <select
              className="auth-inputs"
              required
              name="purchased"
              defaultChecked={seedStore.purchased}
              onChange={(e) => formHandler(e)}
            >
              <option value={""}>- Select Strain -</option>
              <option value="Indoor - Hydroponic">Indoor - Hydroponic</option>
              <option value="Indoor - Soil">Indoor - Soil</option>
              <option value="Outdoor - Hydroponic">Outdoor - Hydroponic</option>
              <option value="Outdoor - Soil">Outdoor - Soil</option>
              <option value="Dispensary Purchased">Dispensary Purchased</option>
              <option value="Seeds">Seeds</option>
            </select>
          </div>
        </div>
        <div className="form-control h-auto p-0 bg-transparent border-0 mb-3">
          <label className="text-black mb-2 font-weight-600 font-18-100">
            Description
          </label>
          <textarea
            onChange={(e) => formHandler(e)}
            className="auth-inputs-textarea"
            placeholder="Enter description here..."
            required
            name="description"
            value={seedStore.description}
          />
        </div>

        <label className="text-black mb-2 font-weight-600 font-18-100">
          Upload Images
        </label>
        <div className="d-flex flex-md-row flex-column align-items-center gap-3 justify-content-between mb-2">
          <label className="upload-files cr-p">
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
            className="add-mores bg-transparent border-white text-black gap-2"
            onClick={() => addMore()}
            type="button"
            disabled={
              !seedStore.quantity ||
              !seedStore.cost ||
              !seedStore.purchased ||
              !seedStore.description
            }
          >
            <Add1 />
            Add More Strains
          </button>
        </div>
        <div className="d-flex flex-sm-row flex-column align-items-center gap-3 justify-content-end  mt-4">
          <button
            className="green-btn-outlines custom-w min-width-208"
            type="button"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            className={`green-btn custom-w min-width-208 ${
              !seedStore.quantity ||
              !seedStore.cost ||
              !seedStore.purchased ||
              !seedStore.description
                ? "disabled-button"
                : "enabled-button"
            }`}
            data-bs-dismiss="modal"
            type="submit"
            disabled={
              !seedStore.quantity ||
              !seedStore.cost ||
              !seedStore.purchased ||
              !seedStore.description
            }
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
};

export default SeedstoreForm;
