import axios from "axios";

const DashboardAxios = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});

DashboardAxios.interceptors.request.use((request) => {
  document.querySelector(".loader-main").style.display = "block";
  return request;
});

DashboardAxios.interceptors.response.use(
  (response) => {
    document.querySelector(".loader-main").style.display = "none";
    return response;
  },
  (error) => {
    document.querySelector(".loader-main").style.display = "none";
    throw error;
  }
);
export default DashboardAxios;
