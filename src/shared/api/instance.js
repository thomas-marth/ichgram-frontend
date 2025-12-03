import axios from "axios";

// console.log(import.meta.env);

const { VITE_API_URL } = import.meta.env;
const baseApiURL = VITE_API_URL ? `${VITE_API_URL}/api` : "/api";

const authInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

export default authInstance;
