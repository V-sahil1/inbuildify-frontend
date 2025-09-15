import { createSlice } from "@reduxjs/toolkit";
import { getUserThunk, logoutThunk, SignInThunk, updateUserThunk } from "./authThunk";
import { Status } from "@lib/constants/enum";
import { Role, User } from "./IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  accessToken: string | null;
  error: string | null;
  status: Status;
}

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
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    // sign in
    builder.addCase(SignInThunk.fulfilled, (state, action) => {
      storeAuthToken(action.payload.data.accessToken);
      storeRefreshToken(action.payload.data.refreshToken);
    });

    // get user
    builder.addCase(getUserThunk.pending, (state) => {
      state.status = Status.PENDING;
      state.error = null;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.user = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload as string;
    });

    // logout thunk
    builder.addCase(logoutThunk.pending, (state) => {
      state.status = Status.PENDING;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;
      state.status = Status.SUCCESS;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload as string;
    });

    // update user
    builder.addCase(updateUserThunk.pending, (state) => {
      state.status = Status.PENDING;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.status = Status.SUCCESS;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
  
