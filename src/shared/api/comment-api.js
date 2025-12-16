import instance from "./instance";

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getPostCommentsApi = (postId) =>
  wrapRequest(instance.get(`/comments/post/${postId}`));

export const createCommentApi = (postId, text) =>
  wrapRequest(instance.post(`/comments/post/${postId}`, { text }));

export const toggleCommentLikeApi = (commentId) =>
  wrapRequest(instance.post(`/comments/${commentId}/like`));
