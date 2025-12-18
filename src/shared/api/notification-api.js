import instance from "./instance";

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getNotificationsApi = () =>
  wrapRequest(instance.get("/notifications"));

export const deleteNotificationApi = (notificationId) =>
  wrapRequest(instance.delete(`/notifications/${notificationId}`));
