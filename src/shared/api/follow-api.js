export const followUserApi = ({ targetUserId }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: { message: `You are now following user ${targetUserId}.` },
        error: null,
      });
    }, 600);
  });
};
