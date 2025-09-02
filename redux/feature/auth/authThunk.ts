import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiWithFormDataMethods } from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse, LoginResponse, User } from "./IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";

export const SignInThunk = createAsyncThunk(
  "auth/signIn",
  async (payload: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.LOGIN, { data: payload });
      storeAuthToken(response.data.accessToken);
      storeRefreshToken(response.data.refreshToken);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const ForgetPasswordThunk = createAsyncThunk(
  "auth/forgetPassword",
  async (payload: { email: string }, {rejectWithValue}) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { data: payload });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const ResetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (payload: { resetPasswordToken: string, password: string, email: string }, {rejectWithValue}) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.RESET_PASSWORD, { data: payload });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const VerifyEmailThunk = createAsyncThunk(
  "auth/verifyEmail",
  async (payload: { otp: string }, {rejectWithValue}) => {
    try {
      const response: ApiResponse<LoginResponse> = await api.post(API_ENDPOINTS.VERIFY_EMAIL, { data: payload });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
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

export const updateUserThunk = createAsyncThunk("user/update", async (payload: FormData, { rejectWithValue }) => {
  try {
      const res = await apiWithFormDataMethods.put<ApiResponse<any>>(API_ENDPOINTS.BUILDER_BASE, payload);
      return res.data;
  } catch (error) {
      return rejectWithValue(error.message);
  }
})

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<{ message: string }> = await api.post(
        API_ENDPOINTS.LOGOUT
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return response.message;
    } catch (e) {
      rejectWithValue(e.message);
    }
    return true;
  }
);
