import axios from "axios";
import { store } from "../../store/store";

// console.log(import.meta.env);

const { VITE_API_URL: baseURL } = import.meta.env;
// console.log(baseURL);
const instance = axios.create({
  baseURL: `${baseURL}/api`,
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && error.message === "accessToken expired") {
      const { auth } = store.getState();
      const { data } = await instance.post("/auth/refresh", {
        refreshToken: auth.refreshToken,
      });
      instance.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
      return instance(originalRequest);
    }
  }
);

export default instance;
