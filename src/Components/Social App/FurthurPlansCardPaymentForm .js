import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { createFurthurSubscription } from "../../Api/index";
import { useNavigate } from "react-router-dom";

const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
    base: {
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF",
      },
    },
    invalid: {
      color: "red",
    },
  },
};

const FurthurCardPaymentForm = ({ type, setModalShow, route }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentMethod = await stripe?.createPaymentMethod({
      type: "card",
      card: elements?.getElement(CardElement),
    });

    if (paymentMethod.error) {
      console.log(paymentMethod.error.message);
    } else {
      const userId = JSON.parse(localStorage.getItem("userdata"))?._id;
      const data = {
        pricingId: type,
        payment_method: paymentMethod?.paymentMethod?.id,
        userId,
      };
      createFurthurSubscription(data, navigate, setModalShow, route);
      console.log(paymentMethod?.paymentMethod?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <div className="text-center mt-3">
        {/* <button
          className="green-btn w-max-content px-5"
          disabled={!type}
          onClick={submitHandler}
        >
          Subscribe Now
        </button> */}
        <Button
          type="submit"
          variant="success"
          className="green-btn w-max-content px-5 mt-4"
        >
          Subscribe Now
        </Button>
      </div>
    </form>
  );
};

export default FurthurCardPaymentForm;
