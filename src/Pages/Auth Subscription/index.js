import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Axios from "../../axios/Axios";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CardPaymentForm from "../../Components/Social App/CardPaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import CummunicationIcon from "../../assets/Images/Cummunication";
import SocialSearchIcon from "../../assets/Images/SocialSearch";
import FollowerListIcon from "../../assets/Images/FollowerList";
import SeeViewIcon from "../../assets/Images/SeeView";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { createSubscription } from "../../Api";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const AuthSubscription = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/address");
  };

  const [type, setType] = useState("");
  const [substype, setsubsType] = useState("");

  const [allPlans, setAllPlans] = useState([]);
  const [currentuserData, setcurrentuserData] = useState("");

  const route = "/address";
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
    Axios.get(
      `${process.env.REACT_APP_API_URI}subscription/user-subscription/${data?._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      }
    )
      .then((response) => {
        setsubsType(response.data.userSubscriptions);
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });

    Axios.get(`${process.env.REACT_APP_API_URI}plan/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    })
      .then((response) => {
        // setAllPlans(response.data.plans);
        setAllPlans(response.data.plans.sort((a, b) => a.price - b.price));
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentuserData(fetchData?.data?.data?.doc);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const handleChange = (event, free) => {
    const planIds = substype?.map((obj) => obj.planId);
    const includesMatchingPlanId = planIds?.includes(event.target.value);
    if (!includesMatchingPlanId) {
      if (free) {
        const route = "/address";
        const data = {
          planId: event.target.value,
          userId: currentuserData._id,
        };
      createSubscription(data, route, navigate, setModalShow, setsubsType);
      } else {
        setModalShow(true);
        setType(event.target.value);
      }
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        show={modalShow}
        onHide={() => setModalShow(false)}
        className="rounded-10 subscription-modal"
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="font-weight-bold"
          >
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <CardPaymentForm
              type={type}
              setModalShow={setModalShow}
              route={route}
              setsubsType={setsubsType}
            />
          </Elements>
        </Modal.Body>
        <Modal.Footer className="border-0 mt-3">
          <Button
            onClick={() => setModalShow(false)}
            className="green-btn-outline text-primary-green w-max-content px-3 close-btn"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="max-width-521 min-width-521">
        <h2 className="auth-model-heading mb-4">Welcome Back!</h2>
        <p className="auth-model-desc mb-5">Please login to your account.</p>

        <form onSubmit={(e) => submitHandler(e)} className="px-4 mt-4 pt-3">
          <div className="self-summary border-0 rounded-4 p-4 d-flex flex-column gap-4 mb-4">
            <p className="font-weight-700 text-white">Subscription benefits:</p>
            <div className="d-flex gap-3 align-items-center">
              <CummunicationIcon />
              <p className="text-grey cut-text">Send unlimited messages</p>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <SocialSearchIcon />
              <p className="text-grey cut-text">Set advanced preferences</p>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <FollowerListIcon />
              <p className="text-grey cut-text">
                Get access to your followers list
              </p>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <SeeViewIcon />
              <p className="text-grey cut-text">See who viewed you and more</p>
            </div>
          </div>
          <div
            className="btn-group btn-group-toggle my-4 flex-column gap-4 w-100"
            data-toggle="buttons"
          >
            <Slider {...settings} className="">
              {allPlans.length > 0 &&
                allPlans.map((plan, index) => {
                  if (plan.type === "grow" || plan.type === "combine") {
                    const planIds = (substype || [])?.map((obj) => obj.planId);
                    return (
                      <label
                        key={index}
                        className={`shadow-none border-0 btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center  ${
                          planIds.includes(plan._id) && "active highlight"
                        }`}
                      >
                        <input
                          type="radio"
                          name="options"
                          id={plan._id}
                          autoComplete="off"
                          readOnly
                          checked={
                            type === plan._id || plan._id === substype?.planId
                          }
                          onClick={(e) => handleChange(e, plan.free)}
                          value={plan._id}
                        />
                        <div
                          className={`subs p-4 w-100 d-flex justify-content-center align-items-center   ${
                            plan._id === substype?.planId
                              ? "active text-dark-black"
                              : "text-grey border-grey"
                          }`}
                        >
                          <p className="font-32-social font-weight-700 border-bottom border-grey pb-3 text-capitalize">
                            {`$${plan.price}${
                              plan?.interval ? ` / ${plan?.interval}` : ""
                            }`}
                          </p>
                          <div className="px-3 pt-3">
                            <p className="font-18-social font-weight-700">
                              {plan.name}
                            </p>
                            {/* <p className="font-16-social font-weight-400">
                              {`SAVE ${plan.discount}`}
                            </p> */}
                          </div>
                        </div>
                      </label>
                    );
                  }
                })}
            </Slider>
          </div>
        </form>

        {currentuserData.isPremium && (
          <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
            <button
              className="green-btn w-max-content px-5"
              onClick={submitHandler}
            >
              Next
            </button>
          </div>
        )}
        <p className="font-14 font-weight-400 text-light-grey mt-3 text-center">
          Recurring billing, cancel anytime
        </p>
        <p className="font-14 font-weight-400 text-light-grey mt-4 pt-2 px-4">
          Please strictly follow the community rules listed below. If you become
          aware of content with child sexual abuse imagery or human sex
          trafficking, please report it to us and to the appropriate
          authorities! Please strictly follow the community rules listed below.
          If you become aware of content with child sexual abuse imagery or
          human sex trafficking, please report it to us and to the appropriate
          authorities!{" "}
        </p>
      </div>
    </>
  );
};

export default AuthSubscription;
