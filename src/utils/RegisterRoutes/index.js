import Hooks from "../../hooks";

export const RegisteredRoutes = ({ component: Component }) => {
  const { IsUserLoggedIn } = Hooks();
  if (IsUserLoggedIn()) {
    // window.history.back();
    return Component;
  } else {
    return Component;
  }
};
