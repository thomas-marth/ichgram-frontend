export const selectAuthRequest = (store) => {
  return {
    loading: store.auth.loading,
    error: store.auth.error,
    isSignupSuccess: store.auth.isSignupSuccess,
  };
};

export const selectUser = (store) => store.auth.user;
export const selectIsAuthenticated = (store) => Boolean(store.auth.accessToken);
