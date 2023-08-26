import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { createSubscription } from "../../Api/index";
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

const CardPaymentForm = ({ type, setModalShow, route, setsubsType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  console.log(route);

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
        planId: type,
        payment_method: paymentMethod?.paymentMethod?.id,
        userId,
      };
      createSubscription(data, route, navigate, setModalShow, setsubsType);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <div className="text-center mt-3">
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

export default CardPaymentForm;
