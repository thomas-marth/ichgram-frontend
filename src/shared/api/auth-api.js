import instance from "./instance";

export const signupUserApi = async (payload) => {
  const { data } = await instance.post("/auth/signup", payload);
  return data;
};
