import instance from "./instance";

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getMessagesWithUserApi = (userId, config = {}) =>
  wrapRequest(instance.get(`/messages/with/${userId}`, config));

export const sendMessageApi = (payload) =>
  wrapRequest(instance.post(`/messages`, payload));

export const getLastMessagesForUserApi = () =>
  wrapRequest(instance.get(`/messages/last-for-all`));
