import Hooks from "../../hooks";

export const ProtectedRoutes = ({ component: Component }) => {
  const { IsUserLoggedIn } = Hooks();
  if (IsUserLoggedIn()) {
    return Component;
  } else {
    return window.history.back();
  }
};
