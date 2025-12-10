import axios from "axios";
import { store } from "../../redux/store";
import { logout, setCredentials } from "../../redux/auth/authSlice";

// console.log(import.meta.env);

const { VITE_API_URL: baseURL } = import.meta.env;
// console.log(baseURL);
const instance = axios.create({
  baseURL: `${baseURL}/api`,
});

instance.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();

    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 && message === "accessToken expired") {
      const { auth } = store.getState();

      try {
        const { data } = await instance.post("/auth/refresh", {
          refreshToken: auth.refreshToken,
        });

        const authHeader = `Bearer ${data.accessToken}`;
        instance.defaults.headers["Authorization"] = authHeader;
        originalRequest.headers.Authorization = authHeader;
        store.dispatch(setCredentials(data));

        return instance(originalRequest);
      } catch {
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
