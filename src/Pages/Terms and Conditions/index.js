import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TermsConditionsPage = () => {
  const [terms] = useState(false);
  const [privacy] = useState(false);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [userToken, setuserToken] = useState();
  useEffect(() => {
    const currentUser = localStorage.getItem("user-token-signup");
    setuserToken(currentUser);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (terms && privacy) {
      localStorage.setItem("user-token", userToken);
      navigate("/home");
      toast.success("Welcome");
    }
    if (terms && !privacy) {
      toast.error("Plase Check Privacy Policy");
    }
    if (!terms && privacy) {
      toast.error("Plase Check Terms & Conditions");
    }
  };
  return (
    <div className="max-width-792">
      <h2 className="auth-model-heading mb-4 pb-3">
        Click and agree to the Terms & Conditions and Privacy Policy to proceed
      </h2>
      <form onSubmit={(e) => submitHandler(e)}>
        <p className="text-grey font-16">
          Lorem ipsum dolor sit amet consectetur. Non nisl risus felis egestas
          lobortis elementum sed sapien sit. Orci pellentesque purus ut posuere.
          Suspendisse blandit commodo non ornare felis. Pharetra dictum nibh
          nulla duis sapien molestie. Velit turpis cursus id duis lobortis ut.
          Viverra volutpat libero malesuada faucibus lorem quam. Adipiscing
          suspendisse feugiat vitae mattis viverra tincidunt amet aliquet
          gravida. Vitae ullamcorper consequat eget nullam pellentesque massa.
          Risus amet eget neque rhoncus quis neque. Rhoncus augue lacus est eget
          cursus. Sit odio etiam risus aliquam enim. Viverra placerat sit nec
          lorem hendrerit sociis ut morbi. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Habitasse tristique tincidunt
          pulvinar aliquam et. Diam cras gravida sem at. Diam urna ultricies
          massa faucibus lectus massa sociis proin. Nisl varius natoque cras
          malesuada venenatis maecenas sed facilisis. Diam urna ultricies massa
          faucibus lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis. Diam urna ultricies massa faucibus
          lectus massa sociis proin. Nisl varius natoque cras malesuada
          venenatis maecenas sed facilisis.
        </p>

        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-5">
          <button
            className="green-btn-outline custom-w min-width-208"
            onClick={() => goBack()}
          >
            Back
          </button>
        </div>
      </form>
      <p className="text-center text-grey mt-5 pt-sm-0 pt-3 font-16">
        Terms of use | Privacy Policy
      </p>
    </div>
  );
};

export default TermsConditionsPage;
