import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import { CreateFacadeState, IFacadeState } from "./IFacadeState";

export const getFacades = createAsyncThunk("facade/getAll", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get<ApiResponse<{ facades: IFacadeState[] }>>(API_ENDPOINTS.FACADE_BASE);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const createFacade = createAsyncThunk("facade/create", async (payload: CreateFacadeState, { rejectWithValue }) => {
    try {
        const res = await api.post<ApiResponse<IFacadeState>>(API_ENDPOINTS.FACADE_BASE, { data: payload });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
