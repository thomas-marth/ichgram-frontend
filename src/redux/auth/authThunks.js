import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "./../../shared/api/auth-api";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.signupUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue({
        email: error?.response?.data.message || error?.message,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.loginUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue({
        email: error?.response?.data.message || error?.message,
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "current",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const data = await authApi.getCurrentUserApi(auth.accessToken);
      return data;
    } catch (error) {
      return rejectWithValue({
        email: error?.response?.data.message || error?.message,
      });
    }
  }
);
