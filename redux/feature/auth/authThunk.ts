import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";

export const SignInThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      const response = api.post("/auth/login", { data: payload });
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const SignUpThunk = createAsyncThunk(
  "auth/signup",
  async (payload: { email: string; password: string, firstName: string, lastName: string }, thunkAPI) => {
    try {
      const response = api.post("/auth/signup", { data: payload });
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  return true;
});
