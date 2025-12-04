export const selectAuthRequest = (store) => {
  return {
    loading: store.auth.loading,
    error: store.auth.error,
    isSignupSuccess: store.auth.isSignupSuccess,
  };
};
