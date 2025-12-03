import axios from "axios";

const { VITE_API_URL } = import.meta.env;

const apiBase = VITE_API_URL ?? window.location.origin;
const normalizedBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
const baseURL = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

const authInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default authInstance;
