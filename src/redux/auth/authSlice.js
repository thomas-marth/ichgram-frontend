import { createSlice } from "@reduxjs/toolkit";
import { signupUser } from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
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
        state.accessToken = payload.accessToken || null;
        state.refreshToken = payload.refreshToken || null;
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default authSlice.reducer;
