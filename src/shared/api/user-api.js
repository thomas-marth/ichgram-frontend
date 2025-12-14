import instance from "./instance";

export const getUsers = async () => {
  const { data } = await instance.get("/users");
  return data;
};

export const getUserById = async (userId) => {
  const { data } = await instance.get(`/users/${userId}`);
  return data;
};
