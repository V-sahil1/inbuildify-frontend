import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse, LoginResponse, User } from "./IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";

export const SignInThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.LOGIN, { data: payload });
      storeAuthToken(response.data.accessToken);
      storeRefreshToken(response.data.refreshToken);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const ForgetPasswordThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string }, thunkAPI) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.FORGET_PASSWORD, { data: payload });
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
// refgister api with payload
// export const SignUpThunk = createAsyncThunk(
//   "auth/signup",
//   async (payload: { email: string; password: string, firstName: string, lastName: string }, thunkAPI) => {
//     try {
//       const response = api.post("/auth/signup", { data: payload });
//       return response;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

export const getUserThunk = createAsyncThunk(
  "auth/getUser",
  async (_,{rejectWithValue}) => {
    try {
      const response: ApiResponse<User> = await api.get(API_ENDPOINTS.PROFILE);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return true;
});
