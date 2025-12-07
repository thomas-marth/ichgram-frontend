import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser } from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  isSignupSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetSignupStatus: (state) => {
      state.isSignupSuccess = false;
      state.error = null;
    },
    logout: () => ({ ...initialState }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSignupSuccess = false;
      })
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user || null;
        state.isSignupSuccess = true;
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user || null;
        // state.isLoginSuccess = true;
        state.accessToken = payload.accessToken || null;
        state.refreshToken = payload.refreshToken || null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const resetSignupStatus = authSlice.actions.resetSignupStatus;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;
