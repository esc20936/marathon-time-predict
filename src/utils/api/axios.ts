import axios from "axios";

const API = axios.create({
  baseURL: "http://18.220.100.215:8000/",
});

export default API;