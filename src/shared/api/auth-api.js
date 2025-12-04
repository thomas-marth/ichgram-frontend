import instance from "./instance";

export const signupUserApi = async (payload) => {
  const { data } = await instance.post("/auth/signup", payload);
  return data;
};

export const loginUserApi = async (payload) => {
  const { data } = await instance.post("/auth/login", payload);
  return data;
};

export const resetPasswordApi = async (payload) => {
  const { data } = await instance.post("/auth/reset", payload);
  return data;
};

export const refreshTokensApi = async () => {
  const { data } = await instance.get("/auth/refresh");
  return data;
};

export const logoutUserApi = async () => {
  const { data } = await instance.get("/auth/logout");
  return data;
};
