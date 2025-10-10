import api, { apiWithFormDataMethods } from "@lib/constants/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";
import { invitedUser, invitedUserResponse, user} from "./UserState";

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
      const response: ApiResponse<invitedUser> = await api.post(
        API_ENDPOINTS.INVITE_USER,
        { data: payload }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUsersThunk = createAsyncThunk(
  "user/getAll",
  async (_, {rejectWithValue}) => {
    try {
      const response: ApiResponse<user[]> = await api.get(
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
      const response : ApiResponse<invitedUserResponse> = await api.get(
        API_ENDPOINTS.INVITED_USERS
      );
      return response.data;
    }
    catch(err:any){
        return rejectWithValue(err.message);
    }
  }
)

export const updateUserThunk = createAsyncThunk("user/update", async (payload: FormData, { rejectWithValue }) => {
    try {
        const res = await apiWithFormDataMethods.put<ApiResponse<any>>(API_ENDPOINTS.BUILDER_BASE, payload);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})


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
