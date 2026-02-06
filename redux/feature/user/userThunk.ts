import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
import { storeAuthToken, storeRefreshToken } from '@lib/constants/authToken';
import { invitedUserResponse, IUser, ResetUserPassword } from './UserState';

export const AcceptInviteThunk = createAsyncThunk(
  'user/acceptInvite',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.post(API_ENDPOINTS.ACCEPT_INVITE, {
        data: { name: payload.name, password: payload.password },
        params: { token: payload.token },
      });
      storeAuthToken(response.data.accessToken);
      storeRefreshToken(response.data.refreshToken);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getInvitedUsersThunk = createAsyncThunk(
  'user/invited-users',
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<invitedUserResponse> = await api.get(API_ENDPOINTS.INVITED_USERS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'user/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response: ApiResponse<IUser> = await apiWithFormDataMethods.post(
        API_ENDPOINTS.USER_BASE,
        payload
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUsersThunk = createAsyncThunk(
  'user/getAll',
  async (
    params: { is_active?: boolean; search?: string; role?: string; role_id?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<IUser[]> = await api.get(API_ENDPOINTS.GET_USERS, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<IUser>>(
        API_ENDPOINTS.USER_BASE + '/' + payload.id,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserLockThunk = createAsyncThunk(
  'user/updateUserLock',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IUser>>(API_ENDPOINTS.USER_LOCK(id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStatusThunk = createAsyncThunk(
  'user/updateUserStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IUser>>(API_ENDPOINTS.USER_STATUS(id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserLoginIdThunk = createAsyncThunk(
  'user/updateUserLoginId',
  async (
    payload: { data: { newLoginId: string; emailLoginId: string }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<IUser>>(API_ENDPOINTS.USER_LOGIN_ID(payload.id), {
        data: payload.data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetUserPasswordThunk = createAsyncThunk(
  'user/resetUserPassword',
  async (payload: { data: ResetUserPassword; id: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IUser>>(
        API_ENDPOINTS.RESET_USER_PASSWORD(payload.id),
        {
          data: payload.data,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const getInvitedUsersThunk = createAsyncThunk(
//   'user/invited-users',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response: ApiResponse<invitedUserResponse> = await api.get(API_ENDPOINTS.INVITED_USERS);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const deleteUserThunk = createAsyncThunk(
//   "user/delete",
//   async (userId: string, thunkAPI) => {
//     try {
//       const response: ApiResponse<UserRequest> = await api.delete(
//         `${API_ENDPOINTS.CREATE_USER}/${userId}`
//       );

//       return response;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );
