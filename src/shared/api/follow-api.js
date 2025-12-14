import instance from "./instance";

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const followUserApi = ({ targetUserId }) =>
  wrapRequest(instance.post(`/follows/${targetUserId}`));
