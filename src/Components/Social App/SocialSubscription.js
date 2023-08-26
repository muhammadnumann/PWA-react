import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CummunicationIcon from "../../assets/Images/Cummunication";
import SocialSearchIcon from "../../assets/Images/SocialSearch";
import FollowerListIcon from "../../assets/Images/FollowerList";
import SeeViewIcon from "../../assets/Images/SeeView";
import Axios from "../../axios/Axios";
import { Button, Modal } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardPaymentForm from "./CardPaymentForm";
import FurthurCardPaymentForm from "./FurthurPlansCardPaymentForm ";
import { toast } from "react-toastify";
import { createSubscription } from "../../Api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const SocialSubscription = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/social/lookingfor");
  };

  const [type, setType] = useState("");
  const [messagePlanType, setMessagePlanType] = useState("");
  const [currentUserData, setcurrentUserData] = useState("");

  const [substype, setsubsType] = useState("");

  const [allPlans, setAllPlans] = useState([]);
  const route = "/social/lookingfor";

  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentUserData(data);
    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
    console.log(data);
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
    Axios.get(`${process.env.REACT_APP_API_URI}pricing/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    })
      .then((response) => {})
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);
  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await Axios.get(GetUserUrl);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.doc)
      );
      setcurrentUserData(fetchData?.data?.data?.doc);
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
        const route = "/social/lookingfor";

        const data = {
          planId: event.target.value,
          userId: currentUserData._id,
        };
      createSubscription(data, route, navigate, setModalShow, setsubsType);
      } else {
        setModalShow(true);
        setType(event.target.value);
      }
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);

  return (
    <React.Fragment>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
        className="rounded-10"
        backdrop="static"
        keyboard={false}
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
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={messageModalShow}
        onHide={() => setMessageModalShow(false)}
        className="rounded-10"
        backdrop="static"
        keyboard={false}
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
            <FurthurCardPaymentForm
              type={messagePlanType}
              setModalShow={setMessageModalShow}
              route={route}
            />
          </Elements>
        </Modal.Body>
        <Modal.Footer className="border-0 mt-3">
          <Button
            onClick={() => setMessageModalShow(false)}
            className="green-btn-outline text-primary-green w-max-content px-3 close-btn"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="max-width-521 min-width-521 my-4 mx-3 px-0 subscription">
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
            {allPlans.length > 0 &&
              allPlans.map((plan, index) => {
                if (plan.type === "social" || plan.type === "combine") {
                  const planIds = (substype || [])?.map((obj) => obj.planId);
                  return (
                    <label
                      key={index}
                      className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center ${
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
                      <div className=" p-4 w-100 d-flex flex-sm-row flex-column justify-content-center align-items-center  text-white">
                        <p className="font-24-social line-height-100 font-weight-700 border-grey border-sm-right-bottom border-grey text-capitalize">
                          {`$${plan.price}${
                            plan?.interval ? ` / ${plan?.interval}` : ""
                          }`}
                        </p>
                        <div className="px-3">
                          <p className="font-18-social font-weight-700">
                            {plan.name}
                          </p>
                          {/* <p className="font-16-social font-weight-400 text-light-grey">
                            {`SAVE ${plan.discount}`}
                          </p> */}
                        </div>
                      </div>{" "}
                    </label>
                  );
                }
              })}
          </div>

          {/* <div
            className="btn-group btn-group-toggle my-4 flex-column gap-4 w-100"
            data-toggle="buttons"
          >
            <h3 className="font-weight-700 font-24 mb-4 ">
              Additional Direct Message Plans:
            </h3>
            {messagesPlans?.length > 0 &&
              messagesPlans?.map((plan, index) => {
                if (plan.pricingType === "message") {
                  return (
                    <label
                      key={index}
                      className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center `}
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
                        onChange={handleMessagesPlansChange}
                        value={plan._id}
                      />
                      <div className=" p-4 w-100 d-flex justify-content-center align-items-center text-white">
                        <p className="font-32-social font-weight-700 border-right border-grey pr-3">
                          {`$${plan.price}`}
                        </p>
                        <div className="px-3">
                          <p className="font-18-social font-weight-700">
                            {plan.details}
                          </p>
                          
                        </div>
                      </div>{" "}
                    </label>
                  );
                }
              })}
          </div> */}
        </form>

        {currentUserData.isPremium && (
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
          authorities!
        </p>
      </div>
    </React.Fragment>
  );
};

export default SocialSubscription;
