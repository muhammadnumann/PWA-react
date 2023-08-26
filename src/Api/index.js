import { toast } from "react-toastify";
import Axios from "../axios/Axios";
import axios from "axios";
const VerifyAgeUrl = `${process.env.REACT_APP_API_URI}users/ageVerify`;

const LoginUrl = `${process.env.REACT_APP_API_URI}users/login`;
const PostResponseUrl = `${process.env.REACT_APP_API_URI}userItem`;
const PostDispensaryUrl = `${process.env.REACT_APP_API_URI}dispensary`;
const PostCannabisUrl = `${process.env.REACT_APP_API_URI}cannabisLounge`;
const PostHeadShopUrl = `${process.env.REACT_APP_API_URI}headShop`;
const PostGrowndepotUrl = `${process.env.REACT_APP_API_URI}growDepot`;
const PostSeedStoreUrl = `${process.env.REACT_APP_API_URI}seedStore`;
const FavouriteUrl = `${process.env.REACT_APP_API_URI}users/markFavourite`;
const PostReviewUrl = `${process.env.REACT_APP_API_URI}users/createReview`;
const CreateChatUrl = `${process.env.REACT_APP_API_URI}conversations`;
const CreatePromptMessageUrl = `${process.env.REACT_APP_API_URI}conversations/prompt-message`;

const PostMessageUrl = `${process.env.REACT_APP_API_URI}messages`;
const PostMediaUrl = `${process.env.REACT_APP_API_URI}messages/media_message`;

const SocialSignUpUrl = `${process.env.REACT_APP_API_URI}users/socialSignup`;

export const VerifyAge = async (data, navigate, googleEmail = null) => {
  try {
    localStorage.clear();
    const postData = await Axios.post(VerifyAgeUrl, data);
    sessionStorage.setItem("remember-age", JSON.stringify(postData.data));
    localStorage.setItem("signupData", JSON.stringify(data));
    navigate("/signup", {
      state: {
        googleEmail,
      },
    });
    toast.success("Age Verified Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const PostLoginData = async (loginDetails, rememberCheck, navigate) => {
  try {
    const fetchData = await Axios.post(LoginUrl, loginDetails);
    localStorage.clear();

    if (rememberCheck) {
      sessionStorage.setItem(
        "remember-user",
        rememberCheck ? JSON.stringify(fetchData.data?.data?.user) : ""
      );
    } else {
      sessionStorage.removeItem("remember-user");
    }

    localStorage.setItem("user-token", fetchData?.data?.token);
    localStorage.setItem(
      "userdata",
      JSON.stringify(fetchData?.data?.data?.user)
    );
    toast.success("Welcome");
    console.log(fetchData?.data?.data?.user?.userType);
    if (fetchData?.data?.data?.user?.userType === "retailer") {
      navigate("/home/retailer-dashboard");
    } else {
      navigate("/home");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const PostSignUp = async (
  signInDetails,
  formData,
  navigate,
  googleEmail = null
) => {
  try {
    const SignUpUrl = !googleEmail
      ? `${process.env.REACT_APP_API_URI}users/signup`
      : `${process.env.REACT_APP_API_URI}users/googleSignUp`;
    const fetchData = !googleEmail
      ? await Axios.post(SignUpUrl, formData)
      : await Axios.patch(SignUpUrl, formData);
    localStorage.setItem("user-token", fetchData.data.token);
    localStorage.setItem("userdata", JSON.stringify(fetchData?.data.data.user));
    const dataSignup =
      localStorage.getItem("signupData") &&
      JSON.parse(localStorage.getItem("signupData"));
    const finalData = {
      ...dataSignup,
      ...signInDetails,
    };
    localStorage.setItem("signupData", JSON.stringify(finalData));
    if (signInDetails.userType === "retailer") {
      navigate("/retailer");
    } else {
      navigate("/subscription");
      // navigate("/address");
    }
    toast.success("  Sign up Successful");
    sessionStorage.removeItem("remember-age");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
    localStorage.clear();
  }
};

export const PostRetailerType = async (
  RetailerTypeUrl,
  retailerType,
  navigate
) => {
  try {
    const fetchData = await Axios.patch(RetailerTypeUrl, retailerType);
    localStorage.setItem("userdata", JSON.stringify(fetchData?.data?.user));
    const dataSignup =
      localStorage.getItem("signupData") &&
      JSON.parse(localStorage.getItem("signupData"));
    const finalData = {
      ...dataSignup,
      ...retailerType,
    };
    localStorage.setItem("signupData", JSON.stringify(finalData));
    navigate(`/subscription`);
    toast.success("Retailer Type Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const PostAddress = async (adressUrl, address, navigate) => {
  try {
    const fetchData = await Axios.patch(adressUrl, address);
    localStorage.setItem("userdata", JSON.stringify(fetchData?.data?.user));
    const dataSignup =
      localStorage.getItem("signupData") &&
      JSON.parse(localStorage.getItem("signupData"));
    const finalData = {
      ...dataSignup,
      ...address,
    };
    localStorage.setItem("signupData", JSON.stringify(finalData));
    if (
      JSON.parse(localStorage.getItem("signupData")).userType === "retailer"
    ) {
      navigate("/home/retailer-dashboard");
    } else {
      navigate("/home");
    }
    toast.success("Address Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const PostResponse = async (newArray, navigate) => {
  try {
    await Axios.post(PostResponseUrl, newArray);
    navigate("/home");
    toast.success("Response Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const PostSeedStore = async (data, navigate) => {
  try {
    await Axios.post(PostSeedStoreUrl, data);
    navigate("/address");
    toast.success("Seed Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostSeedStoreform = async (data) => {
  try {
    await Axios.post(PostSeedStoreUrl, data);
    toast.success("Seed Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const PostDispensary = async (data, navigate) => {
  try {
    await Axios.post(PostDispensaryUrl, data);
    navigate("/address");
    toast.success("Dispensary Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostDispensaryform = async (data) => {
  try {
    await Axios.post(PostDispensaryUrl, data);
    toast.success("Dispensary Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostHeadShop = async (data, navigate) => {
  try {
    await Axios.post(PostHeadShopUrl, data);
    navigate("/address");
    toast.success("Head Shop Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostHeadShopform = async (data) => {
  try {
    await Axios.post(PostHeadShopUrl, data);
    toast.success("Head Shop Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostGrowndepotform = async (data) => {
  try {
    await Axios.post(PostGrowndepotUrl, data);
    toast.success("Grown Depot Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostCannabis = async (data, navigate) => {
  try {
    await Axios.post(PostCannabisUrl, data);
    navigate("/address");
    toast.success("Cannabis Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};
export const PostCannabisform = async (data) => {
  try {
    await Axios.post(PostCannabisUrl, data);
    toast.success("Cannabis Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const EditUser = async (
  EditProfileUrl,
  editedData,
  navigate,
  location
) => {
  try {
    const fetchData = await Axios.patch(EditProfileUrl, editedData);
    localStorage.setItem(
      "userdata",
      JSON.stringify(fetchData?.data?.updateUser)
    );
    toast.success("User Edited Successfully");
    if (location?.pathname?.includes("/social/setting")) {
      navigate(-1);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const MarkFavourite = async (userId, pId, category) => {
  try {
    const data = {
      userId: userId,
      pId: pId,
      category: category,
    };
    const fetchData = await Axios.post(FavouriteUrl, data);
    toast.success(fetchData.data.messgae);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const PostReview = async (ratingData) => {
  try {
    await Axios.post(PostReviewUrl, ratingData);
    toast.success("Review Posted Successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const CreateChat = async (
  senderId,
  receiverId,
  navigate,
  conversationType
) => {
  try {
    const data = {
      senderId: senderId,
      receiverId: receiverId,
      conversationType: conversationType,
    };
    const response = await Axios.post(CreateChatUrl, data);
    // toast.success(response?.data?.message);
    navigate(`/chat/${senderId}`);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const CreatePromptMessage = async (
  senderId,
  receiverId,
  productId,
  category,
  navigate,
  conversationType
) => {
  try {
    const data = {
      senderId: senderId,
      receiverId: receiverId,
      category: category ? category : "userItem",
      productId: productId,
      conversationType: conversationType,
    };
    console.log(data);

    const response = await Axios.post(CreatePromptMessageUrl, data);
    toast.success(response?.data?.message);
    navigate(`/chat/${senderId}`);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const PostMessage = async (sendMessage, token) => {
  try {
    console.log(sendMessage);
    await axios.post(PostMessageUrl, sendMessage, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const PostMedia = async (sendMedia, token) => {
  try {
    console.log(sendMedia);
    await axios.post(PostMediaUrl, sendMedia, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

// Social
export const SocialPostSignUp = async (signUpDetails, navigate) => {
  try {
    const fetchData = await Axios.post(SocialSignUpUrl, signUpDetails);
    console.log(fetchData);
    if (fetchData?.data?.hasOwnProperty("checkUser")) {
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.checkUser)
      );
    } else {
      localStorage.setItem(
        "userdata",
        JSON.stringify(fetchData?.data?.data?.user)
      );
      localStorage.setItem("user-token", fetchData?.data?.token);
    }

    navigate("/social/summary");
    toast.success("Sign up Successful");
    sessionStorage.removeItem("remember-age");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
    localStorage.clear();
  }
};

export const createSubscription = (
  data,
  route,
  navigate,
  setModalShow,
  setsubsType
) => {
  Axios.post(`${process.env.REACT_APP_API_URI}subscription`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("user-token")}` },
  })
    .then(async (response) => {
      toast.success(response?.data?.message);
      setModalShow(false);
      if (route !== "") {
        navigate(route);
      }
      Axios.get(
        `${process.env.REACT_APP_API_URI}subscription/user-subscription/${
          JSON.parse(localStorage.getItem("userdata"))._id
        }`,
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

      // const confirmPayment = await stripe?.confirmCardPayment(
      //   response.clientSecret
      // );
      // console.log(response);
      // console.log(confirmPayment);
      // if (confirmPayment?.error) {
      //   toast.error(confirmPayment.error.message);
      // } else {
      //   toast.success(response?.data?.message);
      //   setModalShow(false);
      //   console.log(route);
      //   if (route !== "") {
      //     navigate(route);
      //   }
      // }
    })
    .catch((error) => {
      setModalShow(false);
      toast.error(error.response?.data?.message);
      console.log(error);
    });
};
export const createFurthurSubscription = (
  data,
  navigate,
  setModalShow,
  route
) => {
  Axios.post(`${process.env.REACT_APP_API_URI}paid/purchase-pricing`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user-token")}`,
    },
  })
    .then((response) => {
      toast.success(response?.data?.message);
      setModalShow(false);
      // navigate(route);
    })
    .catch((error) => {
      toast.error(error.response?.data?.message);
      console.log(error);
    });
};

export const googleLogin = (data, navigate) => {
  Axios.post(`${process.env.REACT_APP_API_URI}users/google-login`, data)
    .then((response) => {
      if (!response.data.data.url.includes("platform")) {
        localStorage.setItem(
          "userdata",
          JSON.stringify(response.data.data.user)
        );
        localStorage.setItem("user-token", response.data.token);
      }
      navigate(response.data.data.url);
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response?.data?.message);
    });
};
