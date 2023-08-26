import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

const AllProducts = (props) => {
  const params = useParams();
  const { children } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchedTerm = useDebounce(searchTerm);

  useEffect(() => {
    console.log({ searchTerm });
  }, [debouncedSearchedTerm]);

  const [filter, setFilter] = useState({
    radius: 0,
    area: "",
    quantity: "",
  });
  const formHandler = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();

    const hasRadius = "radius" in params;
    console.log(hasRadius);
    if (hasRadius) {
      console.log("hasRadius");
      let url = window.location.href;
      let modifiedUrl = url.split("radius=")[0];
      const params = new URLSearchParams();
      params.set("radius", filter.radius);
      params.set("address", filter.area);
      params.set("quantity", filter.quantity);

      window.location.href = `${modifiedUrl}${params.radius ? "" : params}`;
    } else {
      if (filter.area !== "") {
        console.log("filter.radius");
        const params = new URLSearchParams();
        params.set("radius", filter.radius);
        params.set("address", filter.area);
        if (filter.quantity !== "") {
          params.set("quantity", filter.quantity);
        }
        const queryString = params.toString();
        console.log(queryString);
        window.location.href = `${window.location.href}/${queryString}`;
      }
    }
  };

  const inputRef1 = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef1.current.getPlaces();
    if (place) {
      setFilter((prevState) => ({
        ...prevState,
        area: place.formatted_address,
      }));
    }
  };

  return (
    <div className="all-product-section ">
      <div className="container mx-auto ">{children}</div>
    </div>
  );
};

export default AllProducts;
