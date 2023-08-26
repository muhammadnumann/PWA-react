import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});

Axios.interceptors.request.use((request) => {
  document.querySelector(".api-loading-bg").style.display = "flex";
  return request;
});

Axios.interceptors.response.use(
  (response) => {
    document.querySelector(".api-loading-bg").style.display = "none";

    return response;
  },
  (error) => {
    document.querySelector(".api-loading-bg").style.display = "none";
    throw error;
  }
);

export default Axios;
