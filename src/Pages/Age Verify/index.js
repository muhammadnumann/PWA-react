import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import CalendarIcon from "../../assets/Images/Calendar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VerifyAge } from "../../Api";

const AgeVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const googleEmail = searchParams.get("email");

  const [value, onChange] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    return defaultDate;
  });
  
  const [isDateValid, setDateValid] = useState(true);
  const [yearPlaceholderText, setYearPlaceholderText] = useState("Enter");
  const [monthPlaceholderText, setMonthPlaceholderText] = useState("Your");
  const [dayPlaceholderText, setDayPlaceholderText] = useState("DOB");

  const [ageVerify, setAgeVerify] = useState({
    date: "",
    province: JSON.parse(localStorage.getItem("signupData"))?.province || value,
  });
  
  const [minimumAge, setMinimumAge] = useState(18);

  useEffect(() => {
    if (ageVerify.province === "AB") {
      setMinimumAge(18);
    } else if (
      ageVerify.province === "NS" ||
      ageVerify.province === "NB" ||
      ageVerify.province === "ON" ||
      ageVerify.province === "MB" ||
      ageVerify.province === "SK" ||
      ageVerify.province === "BC" ||
      ageVerify.province === "YT" ||
      ageVerify.province === "NT" ||
      ageVerify.province === "NU"
    ) {
      setMinimumAge(19);
    } else {
      setMinimumAge(21);
    }
  }, [ageVerify.province]);

  useEffect(() => {
    setAgeVerify((prevState) => ({
      ...prevState,
      date: value,
    }));
  }, [value]);

  const navigate = useNavigate();

  const formHandler = (e) => {
    const { name, value } = e.target;
    setAgeVerify((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    VerifyAge(ageVerify, navigate, googleEmail);
  };
  const handleDatePickerFocus = () => {
    setYearPlaceholderText("YYYY");
    setMonthPlaceholderText("MM");
    setDayPlaceholderText("DD");
  };
  const handleDatePickerChange = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const minimumAgeDate = new Date(
      currentDate.getFullYear() - minimumAge,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (selectedDate <= minimumAgeDate) {
      onChange(date);
      setDateValid(true);
    } else {
      onChange("");
      setDateValid(false);
    }
  };

  const isNextDisabled = !value || value === "";

  return (
    <div className="max-width-521">
      <h2 className="auth-model-heading mb-4">
        Confirm Your Age & Locate Yourself
      </h2>
      <p className="auth-model-desc mb-5">
        You must be of legal age to consume cannabis in your province or state
        of residence to enter our app. By clicking “Next”, You confirm that you
        are of legal age to consume cannabis in the province or state you
        reside.
      </p>
      <form onSubmit={(e) => submitHandler(e)}>
        <select
          className="auth-input mb-3"
          required
          name="province"
          onChange={(e) => formHandler(e)}
          defaultValue={ageVerify.province}
        >
          <option value="">Where are you from?</option>
          <option value="AB">Alberta(AB)</option>
          <option value="BC">British Columbia(BC)</option>
          <option value="MB">Manitoba(MB)</option>
          <option value="NL">Newfoundland and Labrador(NL)</option>
          <option value="NB">New Brunswick(NB)</option>
          <option value="NT">Northwest Territories(NT)</option>
          <option value="NS">Nova Scotia(NS)</option>
          <option value="NU">Nunavut(NU)</option>
          <option value="ON">Ontario(ON)</option>
          <option value="PE">Prince Edward Island (PE)</option>
          <option value="Quebec">Quebec(QC)</option>
          <option value="SK">Saskatchewan(SK)</option>
          <option value="YT">Yukon(YT)</option>
          <option value="AL">Alaska</option>
          <option value="AR">Arizona</option>
          <option value="CA">California</option>
          <option value="CL">Colorado</option>
          <option value="CO">Connecticut</option>
          <option value="IL">Illinois</option>
          <option value="MA">Maine</option>
          <option value="MS">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MO">Montana</option>
          <option value="NE">Nevada</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="OR">Oregon</option>
          <option value="VE">Vermont</option>
          <option value="VI">Virginia</option>
          <option value="WA">Washington</option>
        </select>
        <DatePicker
          onChange={handleDatePickerChange}
          value={value}
          className="auth-input"
          clearIcon={false}
          format="y M d"
          yearPlaceholder={yearPlaceholderText}
          monthPlaceholder={monthPlaceholderText}
          dayPlaceholder={dayPlaceholderText}
          calendarIcon={<CalendarIcon />}
          required={true}
          maxDate={new Date()}
          onFocus={handleDatePickerFocus}
        />

        {!isDateValid && (
          <p className="text-danger mt-1">
            You must be {minimumAge}+ years to enter.
          </p>
        )}
        <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-between mt-5">
          <button
            className="green-btn-outline back-btn"                          
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button className="green-btn next-btn" disabled={isNextDisabled}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgeVerifyPage;
