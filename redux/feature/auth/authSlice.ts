// src/store/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { AuthState, Status } from "./IAuthState";
import { getUserThunk } from "./authThunk";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  accessToken: null,
  error: null,
  status: Status.IDLE,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get user
    builder.addCase(getUserThunk.pending, (state) => {
      state.status = Status.PENDING;
      state.error = null;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.user = action.payload;
      state.status = Status.SUCCEEDED;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.status = Status.FAILED;
      state.error = action.payload as string;
    });
  },
});

export const authReducer = authSlice.reducer;
