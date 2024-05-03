import axios from "axios";

const instance = axios.create({
  // baseURL: "https://xeroapi.5zeroinfo.com",
  baseURL: "http://localhost:8080",
});

export default instance;
