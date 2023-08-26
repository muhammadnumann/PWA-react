import React from "react";
import { useNavigate } from "react-router-dom";

const BudSeedPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/home");
  };
  return (
    <div className="max-width-792 min-width-792">
      <form onSubmit={(e) => submitHandler(e)}>
        <h2 className="font-36 font-weight-700 mb-5">BUD</h2>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-5">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Quantity
            </label>
            <select className="auth-input" required>
              <option value={""}>- Select Quantity -</option>
              <option value={"all"}>All</option>
              <option value={"1-7"}>1-7 Seeds</option>
              <option value={"7-14"}>7-14 Seeds</option>
              <option value={"14-20"}>14-20 Seeds</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Strain
            </label>
            <select className="auth-input" required>
              <option value={""}>- Select Strain -</option>
              <option value="all">All</option>
              <option value="Sativa">Sativa</option>
              <option value="Indica">Indica</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CBD">CBD</option>
            </select>
          </div>
        </div>

        <h2 className="font-36 font-weight-700 mb-5">SEED</h2>
        <div className="d-flex flex-md-row flex-column align-items-center gap-4 justify-content-between mb-5">
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              Quantity
            </label>
            <select className="auth-input" required>
              <option value={""}>- Select Quantity -</option>
              <option value={"1-5"}>1-5 </option>
              <option value={"4-10"}>5-10 </option>
              <option value={"10-15"}>10-15</option>
              <option value={"15-20"}>15-20</option>
              <option value={"20-30"}>20-30</option>
            </select>
          </div>
          <div className="form-control h-auto p-0 bg-transparent border-0">
            <label className="text-white mb-2 font-weight-600 font-18-100">
              {" "}
              Strain
            </label>
            <select className="auth-input" required>
              <option value={""}>- Select Strain -</option>
              <option value="all">All</option>
              <option value="Sativa">Sativa</option>
              <option value="Indica">Indica</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CBD">CBD</option>
            </select>
          </div>
        </div>

        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-5">
          <button
            className="green-btn-outline custom-w min-width-208"
            onClick={() => goBack()}
          >
            Back
          </button>
          <button className="green-btn custom-w min-width-208">Next</button>
        </div>
      </form>
      <p className="text-center text-grey mt-5 font-16">
        Terms of use | Privacy Policy
      </p>
    </div>
  );
};

export default BudSeedPage;
