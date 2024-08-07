import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_BACK_URL,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
