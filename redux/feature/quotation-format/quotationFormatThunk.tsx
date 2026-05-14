import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../auth/IAuthState";
import api from "@lib/constants/api";

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
