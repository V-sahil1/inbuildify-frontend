// src/store/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./IAuthState";
import { loginThunk, logoutThunk } from "./authThunk";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.status = "succeeded";
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
    });
  },
});

export const authReducer = authSlice.reducer;
