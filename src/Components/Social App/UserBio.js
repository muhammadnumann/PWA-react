import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/Axios";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
import SelectAfterIcon from "../../assets/Images/SelectAfter";
import DatePicker from "react-date-picker";
import CalendarIcon from "../../assets/Images/Calendar";

const outdoorOptions = [
  { label: "Hiking", value: "Hiking" },
  { label: "Camping", value: "Camping" },
  { label: "Fishing", value: "Fishing" },
  { label: "Cycling", value: "Cycling" },
  { label: "Running", value: "Running" },
  { label: "Swimming", value: "Swimming" },
  { label: "Gardening", value: "Gardening" },
];
const sportsOptions = [
  { label: "Soccer", value: "Soccer" },
  { label: "Basketball", value: "Basketball" },
  { label: "Football", value: "Football" },
  { label: "Tennis", value: "Tennis" },
  { label: "Martial Arts", value: "Martial Arts" },
  { label: "Skiing", value: "Skiing" },
  { label: "Snowboarding", value: "Snowboarding" },
  { label: "Cricket", value: "Cricket" },
  { label: "Wakeboarding", value: "Wakeboarding" },
];
const fitnessOptions = [
  { label: "Gym", value: "Gym" },
  { label: "Workout Classes", value: "Workout Classes" },
  { label: "Pilates", value: "Pilates" },
  { label: "Meditation", value: "Meditation" },
  { label: "Mindfulness", value: "Mindfulness" },
  { label: "Yoga", value: "Yoga" },
];
const artsAndCultureOptions = [
  { label: "Painting", value: "Painting" },
  { label: "Drawing", value: "Drawing" },
  { label: "Photography", value: "Photography" },
  { label: "Theater", value: "Theater" },
  { label: "Dance", value: "Dance" },
  { label: "Museums", value: "Museums" },
  { label: "Galleries", value: "Galleries" },
  { label: "Poetry", value: "Poetry" },
  { label: "Writing", value: "Writing" },
];
const musicOptions = [
  { label: "Playing an instrument", value: "Playing an instrument" },
  { label: "Singing", value: "Singing" },
  {
    label: "Attending Concerts & Festivals",
    value: "Attending Concerts & Festivals",
  },
  { label: "Listening to Music", value: "Listening to Music" },
  { label: "Composing", value: "Composing" },
  { label: "DJ", value: "DJ" },
];
const travelOptions = [
  { label: "Backpacking", value: "Backpacking" },
  { label: "Road Trips", value: "Road Trips" },
  { label: "Adventure Travel", value: "Adventure Travel" },
  { label: "Relaxing Travel", value: "Relaxing Travel" },
];
const socializingOptions = [
  { label: "Meeting new people", value: "Meeting new people" },
  { label: "Hosting Events", value: "Hosting Events" },
  { label: "Attending Parties", value: "Attending Parties" },
  {
    label: "Joining Clubs or Organizations",
    value: "Joining Clubs or Organizations",
  },
];
const hobbiesOptions = [
  { label: "Cooking", value: "Cooking" },
  { label: "Baking", value: "Baking" },
  { label: "Crafting", value: "Crafting" },
  { label: "Sewing", value: "Sewing" },
  { label: "Knitting", value: "Knitting" },
  { label: "Woodworking", value: "Woodworking" },
  { label: "Model Building", value: "Model Building" },
  { label: "Collecting", value: "Collecting" },
];
const gamingOptions = [
  { label: "Video Games", value: "Video Games" },
  { label: "Board Games", value: "Board Games" },
  { label: "Card Games", value: "Card Games" },
  { label: "Role Playing Games", value: "Role Playing Games" },
  { label: "Virtual Reality", value: "Virtual Reality" },
];
const moviesOptions = [
  { label: "Movie Buff", value: "Movie Buff" },
  { label: "Attending Film Festivals", value: "Attending Film Festivals" },
];
const readingOptions = [
  { label: "Fiction", value: "Fiction" },
  { label: "Non-Fiction", value: "Non-Fiction" },
];
const volunteeringOptions = [
  { label: "Community Service", value: "Community Service" },
  { label: "Fundraising", value: "Fundraising" },
  { label: "Social Activism", value: "Social Activism" },
  { label: "Environmental Causes", value: "Environmental Causes" },
];
const educationAndCareerOptions = [
  { label: "Professional Development", value: "Professional Development" },
  { label: "Networking", value: "Networking" },
  {
    label: "Taking Classes or Workshops",
    value: "Taking Classes or Workshops",
  },
  { label: "Attending Conferences", value: "Attending Conferences" },
];
const spiritualityAndReligionOptions = [
  { label: "Prayer", value: "Prayer" },
  { label: "Meditation", value: "Meditation" },
  {
    label: "Attending Religious Services",
    value: "Attending Religious Services",
  },
  {
    label: "Exploring Spiritual Practices",
    value: "Exploring Spiritual Practices",
  },
];
const consumptionMethodOptions = [
  { label: "Flower", value: "Flower" },
  { label: "Edibles", value: "Edibles" },
  { label: "Topicals", value: "Topicals" },
  { label: "Tinctures", value: "Tinctures" },
];
const musicGenreOptions = [
  { label: "Rock", value: "Rock" },
  { label: "Hip-Hop/Rap", value: "Hip-Hop/Rap" },
  { label: "Pop", value: "Pop" },
  { label: "Reggae", value: "Reggae" },
  { label: "Soca", value: "Soca" },
  { label: "EDM", value: "EDM" },
  { label: "Country", value: "Country" },
  { label: "Jazz", value: "Jazz" },
  { label: "Classical", value: "Classical" },
  { label: "Metal", value: "Metal" },
  { label: "R&B", value: "R&B" },
  { label: "Soul/Blues", value: "Soul/Blues" },
];
const occupationOptions = [
  { label: "Student", value: "Student" },
  { label: "Entrepreneur", value: "Entrepreneur" },
  { label: "Professional", value: "Professional" },
  { label: "Retired", value: "Retired" },
  { label: "Unemployed", value: "Unemployed" },
  { label: "Other", value: "Other" },
];
const socialSettingOptions = [
  { label: "Introvert", value: "introvert" },
  { label: "Extrovert", value: "extrovert" },
  { label: "Both", value: "both" },
];
const SocialUserBio = () => {
  const [currentuserData, setcurrentuserData] = useState();
  const [height, setHeight] = useState({
    feet: "",
    inches: "",
  });
  const [userData, setUserData] = useState(null);
  const [userBio, setUserBio] = useState({
    province: "",
    name: "",
    height: "",
    feet: "",
    inches: "",
    smoking: "",
    politicalBelief: "",
    lookingFor: "",
    preferredStrain: "",
    gender: "",
    age: "",
    location: "",
    dob: "",
    datingLifestyle: "",
    outdoor: "",
    sports: "",
    fitness: "",
    artsAndCulture: "",
    music: "",
    travel: "",
    socializing: "",
    hobbies: "",
    gaming: "",
    movies: "",
    reading: "",
    volunteering: "",
    educationAndCareer: "",
    spiritualityAndReligion: "",
    consumptionMethod: "",
    musicGenre: "",
    occupation: "",
    socialSetting: "",
  });
  
  const [selectedOutdoor, setSelectedoutdoor] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedFitness, setSelectedFitness] = useState([]);
  const [selectedArtsAndCulture, setSelectedArtsAndCulture] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedGaming, setSelectedGaming] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedSocializing, setSelectedSocializing] = useState([]);
  const [selectedReading, setSelectedReading] = useState([]);
  const [selectedVolunteering, setSelectedVolunteering] = useState([]);
  const [selectedEducationAndCareer, setSelectedEducationAndCareer] = useState(
    []
  );
  const [selectedSpiritualityAndReligion, setSelectedSpiritualityAndReligion] =
    useState([]);
  const [selectedConsumptionMethod, setSelectedConsumptionMethod] = useState(
    []
  );
  const [selectedMusicGenre, setSelectedMusicGenre] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState([]);
  const [selectedSocialSetting, setSelectedSocialSetting] = useState([]);
  const [page, setPage] = useState(1);
  const [value, onChange] = useState("");
  const [isDateValid, setDateValid] = useState(true);
  const [yearPlaceholderText, setYearPlaceholderText] = useState("Enter");
  const [monthPlaceholderText, setMonthPlaceholderText] = useState("Your");
  const [dayPlaceholderText, setDayPlaceholderText] = useState("DOB");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [minimumAge, setMinimumAge] = useState(18);

  useEffect(() => {
    const outdoorPlaceholder = document.querySelector(".outdoor .gray");
    if (outdoorPlaceholder) {
      outdoorPlaceholder.textContent = "User types in Outdoor";
    }
    const sportsPlaceholder = document.querySelector(".sports .gray");
    if (sportsPlaceholder) {
      sportsPlaceholder.textContent = "User types in Sports";
    }
    const fitnesPlaceholder = document.querySelector(".fitnes .gray");
    if (fitnesPlaceholder) {
      fitnesPlaceholder.textContent = "User types in Fitness and Wellness: ";
    }
    const artculturePlaceholder = document.querySelector(".artculture .gray");
    if (artculturePlaceholder) {
      artculturePlaceholder.textContent = "User types in Arts and Culture: ";
    }
    const musicPlaceholder = document.querySelector(".music .gray");
    if (musicPlaceholder) {
      musicPlaceholder.textContent = "User types in Music: ";
    }
    const travelPlaceholder = document.querySelector(".travel .gray");
    if (travelPlaceholder) {
      travelPlaceholder.textContent = "User types in Travel: ";
    }
    const socialPlaceholder = document.querySelector(".social .gray");
    if (socialPlaceholder) {
      socialPlaceholder.textContent = "User types in Socializing: ";
    }
    const hobiesPlaceholder = document.querySelector(".hobies .gray");
    if (hobiesPlaceholder) {
      hobiesPlaceholder.textContent = "User types in Hobbies:";
    }
    const gamingPlaceholder = document.querySelector(".gaming .gray");
    if (gamingPlaceholder) {
      gamingPlaceholder.textContent = "User types in Gaming: ";
    }
    const moviesPlaceholder = document.querySelector(".movies .gray");
    if (moviesPlaceholder) {
      moviesPlaceholder.textContent = "User types in Movies: ";
    }
    const readingPlaceholder = document.querySelector(".reading .gray");
    if (readingPlaceholder) {
      readingPlaceholder.textContent = "User types in Reading:";
    }
    const volunteeringPlaceholder = document.querySelector(
      ".volunteering .gray"
    );
    if (volunteeringPlaceholder) {
      volunteeringPlaceholder.textContent =
        "User types in Volunteering or Charity: ";
    }
    const educationPlaceholder = document.querySelector(".education .gray");
    if (educationPlaceholder) {
      educationPlaceholder.textContent = "User types in Education and Career:";
    }
    const spiritPlaceholder = document.querySelector(".spirit .gray");
    if (spiritPlaceholder) {
      spiritPlaceholder.textContent =
        "User types in Spirituality and Religion: ";
    }
    const consumptionPlaceholder = document.querySelector(".consumption .gray");
    if (consumptionPlaceholder) {
      consumptionPlaceholder.textContent =
        "What is your preferred consumption method? ";
    }
    const musicgenrePlaceholder = document.querySelector(".musicgenre .gray");
    if (musicgenrePlaceholder) {
      musicgenrePlaceholder.textContent = "What is your favorite Music Genre? ";
    }
    const occuptionPlaceholder = document.querySelector(".occuption .gray");
    if (occuptionPlaceholder) {
      occuptionPlaceholder.textContent = "What is your occupation? ";
    }
    const socialsettingPlaceholder = document.querySelector(
      ".socialsetting .gray"
    );
    if (socialsettingPlaceholder) {
      socialsettingPlaceholder.textContent =
        "What is your preferred social setting? ";
    }
  }, [page]);
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentuserData(data);
    const storedUser = localStorage.getItem('userBio');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    }
    // if (data.height) {
    //   console.log(data.height);

    //   const heightString = data.height;
    //   const feetIndex = heightString.indexOf("Feets");

    //   if (feetIndex !== -1) {
    //     const heightTillFeet = heightString.substring(0, feetIndex + 5).trim();
    //     const remainingString = heightString.substring(feetIndex + 5).trim();
    //     setHeight({
    //       feet: heightTillFeet,
    //       inches: remainingString,
    //     });
    //     console.log(heightTillFeet, remainingString);
    //   } else {
    //     setHeight({
    //       feet: "",
    //       inches: "",
    //     });
    //   }
    // }

    let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${data?._id}`;
    GetUser(GetUserUrl);
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
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const formHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name.includes("height_feet")) {
      setHeight((prevState) => ({
        ...prevState,
        feet: value,
      }));
      setUserBio((prevState) => ({
        ...prevState,
        height: `${value} ${height.inches}`,
      }));
    }
    if (name.includes("height_inches")) {
      setHeight((prevState) => ({
        ...prevState,
        inches: value,
      }));
      setUserBio((prevState) => ({
        ...prevState,
        height: `${height.feet} ${value}`,
      }));
    } else {
      setUserBio((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();

  const updatedUserBio = {
    province: userBio.province,
    userName: userBio.name,
    height: userBio.height,
    smoking: userBio.smoking,
    politicalBelief: userBio.politicalBelief,
    lookingFor: userBio.lookingFor,
    preferredStrain: userBio.preferredStrain,
    gender: userBio.gender,
    age: value,
    socialSetting: userBio.socialSetting,
    datingLifestyle: userBio.datingLifestyle,
    outdoor: selectedOutdoor.map((activity) => activity.value),
    sports: selectedSports.map((activity) => activity.value),
    fitness: selectedFitness.map((activity) => activity.value),
    artsAndCulture: selectedArtsAndCulture.map((activity) => activity.value),
    music: selectedMusic.map((activity) => activity.value),
    travel: selectedTravel.map((activity) => activity.value),
    socializing: selectedSocializing.map((activity) => activity.value),
    hobbies: selectedHobbies.map((hobby) => hobby.value),
    gaming: selectedGaming.map((activity) => activity.value),
    movies: selectedMovies.map((activity) => activity.value),
    reading: selectedReading.map((activity) => activity.value),
    volunteering: selectedVolunteering.map((activity) => activity.value),
    educationAndCareer: selectedEducationAndCareer.map(
      (activity) => activity.value
    ),
    spiritualityAndReligion: selectedSpiritualityAndReligion.map(
      (activity) => activity.value
    ),
    consumptionMethod: selectedConsumptionMethod.map((method) => method.value),
    musicGenre: selectedMusicGenre.map((genre) => genre.value),
    occupation: selectedOccupation.map((occupation) => occupation.value),
    // socialSetting: selectedSocialSetting.map((setting) => setting.value),
  };

  const EditProfileUrl = `${process.env.REACT_APP_API_URI}users/profileUpdate/${currentuserData?._id}`;
  const submitHandler = async (e) => {
    e.preventDefault();
    setPage(1);

    try {
      console.log(updatedUserBio)
      const fetchData = await Axios.patch(EditProfileUrl, updatedUserBio);
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.updateUser)
      );
      navigate("/social/subscription");
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (userBio.province === "AB") {
      setSelectedMessage("You must be 18+ years to enter.");
    } else if (
      userBio.province === "NS" ||
      userBio.province === "NB" ||
      userBio.province === "ON" ||
      userBio.province === "MB" ||
      userBio.province === "SK" ||
      userBio.province === "BC" ||
      userBio.province === "YT" ||
      userBio.province === "NT" ||
      userBio.province === "NU"
    ) {
      setMinimumAge(19);
      setSelectedMessage("You must be 19+ years to enter.");
    } else {
      setMinimumAge(21);
      setSelectedMessage("You must be 21+ years to enter.");
    }
  }, [userBio.province]);

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
  const handleDatePickerFocus = () => {
    setYearPlaceholderText("YYYY");
    setMonthPlaceholderText("MM");
    setDayPlaceholderText("DD");
  };

  function areAllFieldsNotEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  const allFieldsNotEmpty = areAllFieldsNotEmpty(updatedUserBio);

    const terms = (event) => {
      // setUserBio(userBio.name)
    localStorage.setItem("userBio", JSON.stringify(userBio));
    setPage(2)
  };


  return (
    <div className="max-width-521 min-width-521 my-4 mx-3 px-0">
      <h2 className="auth-model-heading mb-4 mx-4">
        Where cannabis enthusiasts meet their match
      </h2>
      <p className="auth-model-desc mb-5 mx-4">
        Smokin’Singles is the dating feature on our cannabis exchange
        application which connects like-minded cannabis enthusiasts. Find your
        perfect match and share your passion for cannabis in a safe and fun
        environment. Swipe right on your next smoking buddy and start a
        conversation today!
      </p>
      <form onSubmit={(e) => submitHandler(e)} className="px-4 mt-4 pt-3">
        {page === 1 && (
          <>
            <input
              className="auth-input mb-4"
              type="text"
              required
              placeholder="Name"
              name="name"
              onChange={(e) => formHandler(e)}
              value={userBio.name}
            />
            <div className="row">
              <div className="col-6 ps-0">
                <select
                  className="auth-input mb-4"
                  required
                  onChange={(e) => formHandler(e)}
                  name="height_feet"
                  value={height?.feet}
                >
                  <option value="">Feets</option>
                  <option value="4 Feets">4 Feets</option>
                  <option value="5 Feets">5 Feets</option>
                  <option value="6 Feets">6 Feets</option>
                  <option value="7 Feets">7 Feets</option>
                  <option value="8 Feets">8 Feets</option>
                </select>
              </div>
              <div className="col-6 pe-0">
                <select
                  required
                  className="auth-input mb-4"
                  onChange={(e) => formHandler(e)}
                  name="height_inches"
                  value={height?.inches}
                >
                  <option value="">Inches</option>
                  <option value="1 Inch">1 Inch</option>
                  <option value="2 Inches">2 Inches</option>
                  <option value="3 Inches">3 Inches</option>
                  <option value="4 Inches">4 Inches</option>
                  <option value="5 Inches">5 Inches</option>
                  <option value="6 Inches">6 Inches</option>
                  <option value="7 Inches">7 Inches</option>
                  <option value="8 Inches">8 Inches</option>
                  <option value="9 Inches">9 Inches</option>
                  <option value="10 Inches">10 Inches</option>
                  <option value="11 Inches">11 Inches</option>
                  <option value="12 Inches">12 Inches</option>
                </select>
              </div>
            </div>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="smoking"
              value={userBio.smoking}
            >
              <option value="">How often do you smoke cannabis?</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="politicalBelief"
              // value="political"
              value={userBio.politicalBelief}
            >
              <option value="">Political belief</option>
              <option value="conservation">Conservative (Republican)</option>
              <option value="liberal">Liberal (Democratic)</option>
              <option value="bloc quebecois">Bloc Quebecois </option>
              <option value="green party">Green Party </option>
              <option value="socialist">Socialist </option>
              <option value="prefernottosay">Prefer not to say </option>
            </select>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="lookingFor"
              value={userBio.lookingFor}
            >
              <option value="">What are you looking for </option>
              <option value="friends">Friends </option>
              <option value="casual">Casual Dating </option>
              <option value="dating">Dating </option>
              <option value="intimate">Intimate encounters </option>
            </select>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="preferredStrain"
              value={userBio.preferredStrain}
            >
              <option value="">What is your preferred strain type? </option>
              <option value="indica">Indica </option>
              <option value="hybrid">Hybrid </option>
              <option value="sativa">Sativa </option>
              <option value="cbd">CBD </option>
            </select>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="gender"
              value={userBio.gender}
            >
              <option value="">What best describes you? </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Transgender ">Transgender </option>
              <option value="others">Others</option>
            </select>
            {/* <select
              className="auth-input mb-4"
              // required
              onChange={(e) => formHandler(e)}
              name="age"
              // value="age"
              value={userBio.age}

              //disabled={currentuserData?.age ? true : false}
            >
              <option value="">What is your age? </option>
              <option value="19-70-all-Canadian">
                Sliding scale from 19 - 70 (in all Canadian Provinces except
                Alberta and Quebec){" "}
              </option>
              <option value="18-70-alberta">
                Sliding scale from 18 - 70 (Alberta)
              </option>
              <option value="21-70-quebec">
                Sliding Scale from 21 - 70 (Quebec){" "}
              </option>
              <option value="21-70-all-legal">
                Sliding Scale from 21 - 70 (All Legal States){" "}
              </option>
              <option value="19-70-trinidad">
                Sliding Scale from 19 - 70 (In Trinidad and Tobago, Jamaica and
                USBI)
              </option>
            </select> */}

            <select
              className="auth-input mb-4"
              required
              name="province"
              onChange={(e) => formHandler(e)}
              value={userBio?.province}
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
            <div className="mb-4">
              <DatePicker
                onChange={handleDatePickerChange}
                value={value}
                className="auth-input"
                clearIcon={false}
                format="y-M-d"
                yearPlaceholder={yearPlaceholderText}
                monthPlaceholder={monthPlaceholderText}
                dayPlaceholder={dayPlaceholderText}
                calendarIcon={<CalendarIcon />}
                required={true}
                maxDate={new Date()}
                onFocus={handleDatePickerFocus}
              />
              {!isDateValid && (
                <p className="text-danger mt-1">{selectedMessage}</p>
              )}
            </div>
            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="datingLifestyle"
              value={userBio.datingLifestyle}
            >
              <option value="">What is your dating lifestyle? </option>
              <option value="traditional">Traditional </option>
              <option value="kink">Kink </option>
            </select>

            <select
              className="auth-input mb-4"
              required
              onChange={(e) => formHandler(e)}
              name="socialSetting"
              value={userBio.socialSetting}
            >
              <option value="">What is your prefered social Setting? </option>
              <option value="introvert">Introvert </option>
              <option value="extrovert">Extrovert </option>
              <option value="both">Both</option>
            </select>

          </>
        )}

        {page === 2 && (
          <>
            <div className="form-control h-auto p-0 bg-transparent border-0 mb-4">
              <label className="text-white mb-2 font-weight-600 font-18-100">
                What are your Interests and Hobbies?
              </label>
            </div>
            <div className="outdoor">
              <MultiSelect
                options={outdoorOptions}
                value={selectedOutdoor}
                onChange={setSelectedoutdoor}
                labelledBy="Prompts would Include "
                className="mb-4 multiselect-custom"
                ArrowRenderer={SelectAfterIcon}
                required
              />
            </div>
            <div className="sports">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={sportsOptions}
                value={selectedSports}
                onChange={setSelectedSports}
                labelledBy="User types in Sports:"
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="fitnes">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={fitnessOptions}
                value={selectedFitness}
                onChange={setSelectedFitness}
                labelledBy="User types in Fitness and Wellness: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="artculture">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={artsAndCultureOptions}
                value={selectedArtsAndCulture}
                onChange={setSelectedArtsAndCulture}
                labelledBy="User types in Arts and Culture: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="music">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={musicOptions}
                value={selectedMusic}
                onChange={setSelectedMusic}
                labelledBy="User types in Music: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="travel">
              <MultiSelect
                ArrowRenderer={SelectAfterIcon}
                options={travelOptions}
                value={selectedTravel}
                onChange={setSelectedTravel}
                labelledBy="User types in Travel: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="social">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={socializingOptions}
                value={selectedSocializing}
                onChange={setSelectedSocializing}
                labelledBy="User types in Socializing: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="hobies">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={hobbiesOptions}
                value={selectedHobbies}
                onChange={setSelectedHobbies}
                labelledBy="User types in Hobbies:"
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="gaming">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={gamingOptions}
                value={selectedGaming}
                onChange={setSelectedGaming}
                labelledBy="User types in Gaming: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="movies">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={moviesOptions}
                value={selectedMovies}
                onChange={setSelectedMovies}
                labelledBy="User types in Movies:"
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="reading">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={readingOptions}
                value={selectedReading}
                onChange={setSelectedReading}
                labelledBy="User types in Reading:"
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="volunteering">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={volunteeringOptions}
                value={selectedVolunteering}
                onChange={setSelectedVolunteering}
                labelledBy="User types in Volunteering or Charity: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="education">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={educationAndCareerOptions}
                value={selectedEducationAndCareer}
                onChange={setSelectedEducationAndCareer}
                labelledBy="User types in Education and Career:"
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="spirit">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={spiritualityAndReligionOptions}
                value={selectedSpiritualityAndReligion}
                onChange={setSelectedSpiritualityAndReligion}
                labelledBy="User types in Spirituality and Religion: "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="consumption">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={consumptionMethodOptions}
                value={selectedConsumptionMethod}
                onChange={setSelectedConsumptionMethod}
                labelledBy="What is your preferred consumption method? "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="musicgenre">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={musicGenreOptions}
                value={selectedMusicGenre}
                onChange={setSelectedMusicGenre}
                labelledBy="What is your favorite Music Genre? "
                className="mb-4 multiselect-custom"
              />
            </div>
            <div className="occuption">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={occupationOptions}
                value={selectedOccupation}
                onChange={setSelectedOccupation}
                labelledBy="What is your occupation? "
                className="mb-4 multiselect-custom"
              />
            </div>
            {/* <div className="socialsetting">
              <MultiSelect
                required
                ArrowRenderer={SelectAfterIcon}
                options={socialSettingOptions}
                value={selectedSocialSetting}
                onChange={setSelectedSocialSetting}
                labelledBy="What is your preferred social setting? "
                className="mb-4 multiselect-custom"
              />
            </div> */}
          </>
        )}
        {allFieldsNotEmpty && (
          <p>
            Thank you for completing our questionnaire – your responses have
            provided valuable information to help find you find your perfect
            match on Smokin’Singles
          </p>
        )}
        {page === 1 ? (
          <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
            <button
              className="green-btn custom-w min-width-208"
              onClick={terms}
              type="button"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="d-flex flex-sm-row flex-column align-items-center gap-4 justify-content-center  mt-4 pt-3">
            <button
              className="green-btn-outline custom-w min-width-208 back-btn"
              type="button"
              onClick={() => setPage(1)}
            >
              Back
            </button>
            <button
              className="green-btn custom-w min-width-208 next-btn"
              type="submit"
              disabled={!allFieldsNotEmpty}
            >
              Match Me Now
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SocialUserBio;
