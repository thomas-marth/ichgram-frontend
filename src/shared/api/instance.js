import axios from "axios";

// console.log(import.meta.env);

const { VITE_API_URL } = import.meta.env;

const normalizeBaseUrl = (url) => url.replace(/\/+$/, "");

const getBaseApiURL = () => {
  if (VITE_API_URL) {
    return `${normalizeBaseUrl(VITE_API_URL)}/api`;
  }

  if (typeof window !== "undefined") {
    return `${normalizeBaseUrl(window.location.origin)}/api`;
  }

  return "https://ichgram-backend.vercel.app/api";
};

const baseApiURL = getBaseApiURL();

const authInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

export default authInstance;
