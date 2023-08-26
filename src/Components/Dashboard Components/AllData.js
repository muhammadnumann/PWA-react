import React, { useEffect } from "react";
import PanicSection from "../../Components/Dashboard Components/PanicSection";
import AllProductsDashboard from "./AllProducts";

const AllData = () => {
  useEffect(() => {
    localStorage.setItem("platform", "grow");
  }, []);
  return (
    <div>
      <PanicSection />
      <AllProductsDashboard />
    </div>
  );
};

export default AllData;
