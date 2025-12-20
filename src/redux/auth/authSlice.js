import { createSlice } from "@reduxjs/toolkit";
import {
  signupUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  isSignupSuccess: false,
};

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  const normalizedId = user.id || user._id;
  return normalizedId ? { ...user, id: normalizedId } : user;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetSignupStatus: (state) => {
      state.isSignupSuccess = false;
      state.error = null;
    },
    logout: () => initialState,
    setCredentials: (state, { payload }) => {
      const { user, accessToken, refreshToken } = payload || {};
      state.user = normalizeUser(user);
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
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
        state.user = normalizeUser(payload?.user ?? null);
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
        state.user = normalizeUser(payload?.user ?? null);
        // state.isLoginSuccess = true;
        state.accessToken = payload?.accessToken || null;
        state.refreshToken = payload?.refreshToken || null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = normalizeUser(payload?.user ?? null);
        state.accessToken = payload?.accessToken || null;
        state.refreshToken = payload?.refreshToken || null;
      })
      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, () => ({ ...initialState }))
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { resetSignupStatus, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
