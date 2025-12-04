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
