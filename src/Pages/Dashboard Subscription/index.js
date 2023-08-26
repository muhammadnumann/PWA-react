import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Axios from "../../axios/Axios";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CardPaymentForm from "../../Components/Social App/CardPaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import FurthurCardPaymentForm from "../../Components/Social App/FurthurPlansCardPaymentForm ";
import { toast } from "react-toastify";
import { createSubscription } from "../../Api";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const DashboardSubscription = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/address");
  };

  const [type, setType] = useState("");
  const [substype, setsubsType] = useState("");
  const [messagePlanType, setMessagePlanType] = useState("");

  const [allPlans, setAllPlans] = useState([]);

  const [currentuserData, setcurrentuserData] = useState("");

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
        setAllPlans(response.data.plans.sort((a, b) => a.price - b.price));
        console.log(response);
      })
      .catch((error) => {
        console.log(error?.response?.data);
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
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const route = "";

  const handleChange = (event, free) => {
    const route = "";
    const planIds = substype?.map((obj) => obj.planId);
    const includesMatchingPlanId = planIds?.includes(event.target.value);

    if (!includesMatchingPlanId) {
      if (free) {
        console.log("called");
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
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        show={messageModalShow}
        onHide={() => setMessageModalShow(false)}
        className="rounded-10 subscription-modal"
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
      <div className="all-product-section dashboard-subs">
        <div className="container mx-auto">
          <h2 className="allproduct-heading mx-4">Recurring billing</h2>
          <p className="font-18 text-dark-black mt-4 pt-2 px-4">
            Please strictly follow the community rules listed below. If you
            become aware of content with child sexual abuse imagery or human sex
            trafficking, please report it to us and to the appropriate
            authorities! Please strictly follow the community rules listed
            below. If you become aware of content with child sexual abuse
            imagery or human sex trafficking, please report it to us and to the
            appropriate authorities!{" "}
          </p>
          <form onSubmit={(e) => submitHandler(e)} className="ms-12 me-12 mt-5">
            <div className="row m-0 gap-md-0 gap-4">
              <div className="col-md-6">
                <h3 className="font-weight-700 font-24 mb-4">
                  Subscription benefits:
                </h3>
              </div>
              <div className="col-md-6 d-md-block d-none">
                <h3 className="font-weight-700 font-24 mb-4">Payment Plans:</h3>
              </div>
            </div>
            <div className="row m-0 gap-md-0 gap-4">
              <div className="col-md-6">
                <div className="subsciption-benifits mt-0">
                  <ul>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Unlimited Likes
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        See Who Likes You
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Unlimited Rewind
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Hide Advertisements
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Control Your Profile
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Control Who You See
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Send unlimited messages
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Set advanced preferences
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Get access to your followers list
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        See who viewed you and more
                      </h4>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Passport
                      </h4>
                      <p className="font-14-100 mt-1">
                        Match and chat with poeple anywhere in the world
                      </p>
                    </li>
                    <li>
                      <h4 className="font-16-social font-weight-600">
                        Interest Indicators
                      </h4>
                      <p className="font-14-100 mt-1">
                        Premium members get Interest Indicators (which notifies
                        members immediately they’ve been super liked)
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-md-none d-block">
                  <h3 className="font-weight-700 font-24 mb-4">
                    Payment Plans:
                  </h3>
                </div>
                <div
                  className="btn-group btn-group-toggle h-100 flex-column gap-4 w-100"
                  data-toggle="buttons"
                >
                  {allPlans?.length > 0 &&
                    allPlans?.map((plan, index) => {
                      if (plan.type === "grow" || plan.type === "combine") {
                        const planIds = (substype || [])?.map(
                          (obj) => obj.planId
                        );
                        return (
                          <>
                            <label
                              key={index}
                              className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center border-2 ${
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
                                  type === plan._id ||
                                  plan._id === substype?.planId
                                }
                                onClick={(e) => handleChange(e, plan.free)}
                                value={plan._id}
                              />
                              <div className=" px-3 py-4 w-100 d-flex flex-sm-row flex-column justify-content-center align-items-center text-dark-black ">
                                <p className="font-24-social line-height-100 font-weight-700 border-sm-right-bottom border-grey pr-sm-3 text-capitalize">
                                  {`$${plan.price}${
                                    plan?.interval ? ` / ${plan?.interval}` : ""
                                  }`}
                                </p>
                                <div className="px-3">
                                  <p className="font-18-social font-weight-700">
                                    {plan.name}
                                  </p>
                                </div>
                              </div>
                            </label>
                          </>
                        );
                      }
                    })}
                </div>
              </div>
            </div>

            {/* <div className="pt-4">
              <h3 className="font-weight-700 font-24 mb-4 ms-12 me-12 pt-5 pt-md-0">
                Additional Direct Message Plans:
              </h3>
              <div
                className="row m-0 btn-group btn-group-toggle gap-md-0 gap-4 h-100 w-100"
                data-toggle="buttons"
              >
                {messagesPlans?.length > 0 &&
                  messagesPlans?.map((plan, index) => {
                    if (plan.pricingType === "message") {
                      return (
                        <div className="col-lg-4 col-md-6 col-12 mb-md-4 mb-lg-0">
                          <label
                            key={index}
                            className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center border-2 ${
                              plan._id === substype?.planId && "active"
                            }`}
                          >
                            <input
                              type="radio"
                              name="options"
                              id={plan._id}
                              autoComplete="off"
                              readOnly
                              checked={
                                type === plan._id ||
                                plan._id === substype?.planId
                              }
                              onChange={handleMessagesPlansChange}
                              value={plan._id}
                            />
                            <div className=" p-4 w-100 d-flex justify-content-center align-items-center text-dark-black ">
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
                        </div>
                      );
                    }
                  })}
              </div>
            </div> */}

            {/* <div className="pt-4">
              <h3 className="font-weight-700 font-24 mb-4 ms-12 me-12 ">
                Additional Boosted Profile:
              </h3>
              <div
                className="row m-0 btn-group btn-group-toggle gap-md-0 gap-4 h-100 w-100"
                data-toggle="buttons"
              >
                {messagesPlans?.length > 0 &&
                  messagesPlans?.map((plan, index) => {
                    if (plan.pricingType === "boost") {
                      return (
                        <div className="col-lg-4 col-md-6 col-12 mb-md-4 mb-lg-0">
                          <label
                            key={index}
                            className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center border-2 ${
                              plan._id === substype?.planId && "active"
                            }`}
                          >
                            <input
                              type="radio"
                              name="options"
                              id={plan._id}
                              autoComplete="off"
                              readOnly
                              checked={
                                type === plan._id ||
                                plan._id === substype?.planId
                              }
                              onChange={handleMessagesPlansChange}
                              value={plan._id}
                            />
                            <div className=" p-4 w-100 d-flex justify-content-center align-items-center text-dark-black ">
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
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
            <div className="pt-4">
              <h3 className="font-weight-700 font-24 mb-4 ms-12 me-12">
                Additional Rewind Profile Plans:
              </h3>
              <div
                className="row m-0 btn-group btn-group-toggle gap-md-0 gap-4 h-100 w-100"
                data-toggle="buttons"
              >
                {messagesPlans?.length > 0 &&
                  messagesPlans?.map((plan, index) => {
                    if (plan.pricingType === "rewinds") {
                      return (
                        <div className="col-lg-4 col-md-6 col-12 mb-md-4 mb-lg-0">
                          <label
                            key={index}
                            className={`btn subscription-offer p-0 w-100 font-14 bg-grey d-flex align-items-center border-2 ${
                              plan._id === substype?.planId && "active"
                            }`}
                          >
                            <input
                              type="radio"
                              name="options"
                              id={plan._id}
                              autoComplete="off"
                              readOnly
                              checked={
                                type === plan._id ||
                                plan._id === substype?.planId
                              }
                              onChange={handleMessagesPlansChange}
                              value={plan._id}
                            />
                            <div className=" p-4 w-100 d-flex justify-content-center align-items-center text-dark-black ">
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
                        </div>
                      );
                    }
                  })}
              </div>
            </div> */}
          </form>

          {/* <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
          <button
            className="green-btn w-max-content px-5"
            onClick={submitHandler}
          >
            Skip For Now
          </button>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default DashboardSubscription;
