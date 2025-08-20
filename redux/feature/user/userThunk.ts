import api from "@lib/constants/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";
import { UserRequest, UserResponse } from "./UserState";

export const AcceptInviteThunk = createAsyncThunk(
    "user/acceptInvite",
    async (payload: any, {rejectWithValue}) => {
        try {
            const response: ApiResponse<any> = await api.post(API_ENDPOINTS.ACCEPT_INVITE, { data: { name: payload.name, password: payload.password }, params: { token: payload.token } });
            storeAuthToken(response.data.accessToken);
            storeRefreshToken(response.data.refreshToken);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createUserThunk = createAsyncThunk(
  "user/create",
  async (
    payload: { email: string; role:string; },
    {rejectWithValue}
  ) => {
    try {
      const response: ApiResponse<UserRequest> = await api.post(
        API_ENDPOINTS.INVITE_USER,
        { data: payload }
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUsersThunk = createAsyncThunk(
  "user/getAll",
  async (_, {rejectWithValue}) => {
    try {
      const response: ApiResponse<UserResponse> = await api.get(
        API_ENDPOINTS.GET_USERS
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getInvitedUsersThunk = createAsyncThunk(
  "user/invited-users",
  async(_,{rejectWithValue}) =>{
    try{
      const response : ApiResponse<UserResponse> = await api.get(
        API_ENDPOINTS.INVITED_USERS
      );
      return response;
    }
    catch(err:any){
        return rejectWithValue(err.message);
    }
  }
)

// export const updateUserThunk = createAsyncThunk(
//   "user/update",
//   async (
//     {
//       userId,
//       payload,
//     }: { userId: string; payload: { name: string; phone: string; address: string } },
//     thunkAPI
//   ) => {
//     try {
//       const response: ApiResponse<UserRequest> = await api.put(
//         `${API_ENDPOINTS.CREATE_USER}/${userId}`,
//         {
//           data: payload, // ✅ only send object of object
//         }
//       );

//       return response;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.message);
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
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );
