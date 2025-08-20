import api from "@lib/constants/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { storeAuthToken, storeRefreshToken } from "@lib/constants/authToken";

export const AcceptInviteThunk = createAsyncThunk(
    "user/acceptInvite",
    async (payload: any, thunkAPI) => {
        try {
            const response: ApiResponse<any> = await api.post(API_ENDPOINTS.ACCEPT_INVITE, { data: { name: payload.name, password: payload.password }, params: { token: payload.token } });
            storeAuthToken(response.data.accessToken);
            storeRefreshToken(response.data.refreshToken);
            return response;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
