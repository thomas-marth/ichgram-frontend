import instance from "./instance";

export const getUsers = async () => {
  const { data } = await instance.get("/users");
  return data;
};
