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
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user || null;
        state.isSignupSuccess = true;
        // state.accessToken = payload.accessToken || null;
        // state.refreshToken = payload.refreshToken || null;
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
        state.isSignupSuccess = true;
        state.accessToken = payload.accessToken || null;
        state.refreshToken = payload.refreshToken || null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default authSlice.reducer;
