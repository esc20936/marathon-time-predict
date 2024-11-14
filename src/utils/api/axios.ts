import axios from "axios";

const API = axios.create({
  baseURL: "https://c319-18-220-100-215.ngrok-free.app",
});

export default API;