import { toast } from "react-toastify";

const Hooks = () => {
  const token = localStorage.getItem("user-token");
  const IsUserLoggedIn = () => {
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  const Logout = (navigate) => {
    localStorage.clear();
    sessionStorage.removeItem("userType");
    toast.success("Logout successful!");
    navigate("/");
  };

  return {
    IsUserLoggedIn,
    Logout,
  };
};

export default Hooks;
