import axios from "axios";

const API = axios.create({
  baseURL: "https://mlops-api.click/",
});

export default API;