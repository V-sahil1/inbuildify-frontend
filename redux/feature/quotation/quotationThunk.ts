import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import api from "@lib/constants/api";
import { QuotationItemPayload, QuotationResponse } from "./IQuotationState";

export const createQuotation = createAsyncThunk(
  "quotation/create",
  async (payload: {quoteId?: string , quotationPayload: QuotationItemPayload}, { rejectWithValue }) => {
    try {
      const {quoteId, quotationPayload} = payload;
      const apiEndpoint = quoteId ? API_ENDPOINTS.QUOTATION_BASE + "/" + quoteId + "/version" : API_ENDPOINTS.QUOTATION_BASE;
      const res = await api.post<ApiResponse<QuotationResponse>>(
        apiEndpoint,
        { data: quotationPayload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationById = createAsyncThunk(
  "quotation/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationResponse>>(
        API_ENDPOINTS.QUOTATION_BASE + "/" + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationVersionById = createAsyncThunk(
  "quotation/getVersionById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationResponse>>(
        API_ENDPOINTS.QUOTATION_VERSION + "/" + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);