import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiWithFormDataMethods } from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import { IFacadeState } from "./IFacadeState";

export const getFacades = createAsyncThunk("facade/getAll", async (filters: { dwelling_type?: string } = {}, { rejectWithValue }) => {
    try {
        let url = API_ENDPOINTS.FACADE_BASE;
        
        // Add query parameters if dwelling_type filter is provided
        if (filters && filters.dwelling_type) {
            const queryParams = new URLSearchParams();
            queryParams.append('dwelling_type', filters.dwelling_type);
            url = `${API_ENDPOINTS.FACADE_BASE}?${queryParams.toString()}`;
        }
        
        const res = await api.get<ApiResponse<{ facades: IFacadeState[] }>>(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const createFacade = createAsyncThunk("facade/create", async (payload: FormData, { rejectWithValue }) => {
    try {
        const res = await apiWithFormDataMethods.post<ApiResponse<IFacadeState>>(API_ENDPOINTS.FACADE_BASE, payload);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const updateFacade = createAsyncThunk("facade/update", async (payload: {data: FormData, facadeId: string}, { rejectWithValue }) => {
    try {
        const res = await apiWithFormDataMethods.put<ApiResponse<IFacadeState>>(`${API_ENDPOINTS.FACADE_BASE}/${payload.facadeId}`, payload.data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const deleteFacade = createAsyncThunk("facade/delete", async (payload: string, { rejectWithValue }) => {
    try {
        const res = await api.delete<ApiResponse<IFacadeState>>(`${API_ENDPOINTS.FACADE_BASE}/${payload}`);
        return payload;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

