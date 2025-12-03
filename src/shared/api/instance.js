import axios from "axios";

// console.log(import.meta.env);

const { VITE_API_URL: baseURL } = import.meta.env;
// console.log(baseURL);
const authInstance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

export default authInstance;
