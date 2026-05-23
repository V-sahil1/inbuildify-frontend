import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../auth/IAuthState";
import api, { apiWithFormDataMethods } from "@lib/constants/api";

export const getallQuotationFormatThunk = createAsyncThunk(
    'quotationFormat/getall',
    async () => {
        try{
            const res = await api.get<ApiResponse>(API_ENDPOINTS.QUOTATION_FORMAT);
            return res.data;
            
        } catch (error) {
            return error.message;
        }
    }
);

export const getQuotationFormatByIdThunk = createAsyncThunk(
    'quotationFormat/getById',
    async (id: string) => {
        try{
            const res = await api.get<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT}/${id}`);
            return res.data;
            
        } catch (error) {
            return error.message;
        }
    }
);


export const createQuotationFormatThunk = createAsyncThunk(
  'quotationFormat/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(API_ENDPOINTS.QUOTATION_FORMAT, 
        {data: payload}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationFormatThunk = createAsyncThunk(
  'quotationFormat/update',
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT}/${id}`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
