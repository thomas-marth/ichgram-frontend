import instance from "./instance";

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const likePostApi = (postId) =>
  wrapRequest(instance.post(`/likes/${postId}/like`));

export const unlikePostApi = (postId) =>
  wrapRequest(instance.delete(`/likes/${postId}/unlike`));

export const getUserLikedPostsApi = (userId) =>
  wrapRequest(instance.get(`/likes/user/${userId}`));

export const getPostLikesApi = (postId) =>
  wrapRequest(instance.get(`/likes/${postId}/likes`));
