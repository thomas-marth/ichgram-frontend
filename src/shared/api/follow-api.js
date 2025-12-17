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

export const unfollowUserApi = ({ targetUserId }) =>
  wrapRequest(instance.delete(`/follows/${targetUserId}`));

export const getUserFollowingApi = (userId) =>
  wrapRequest(instance.get(`/follows/${userId}/following`));
