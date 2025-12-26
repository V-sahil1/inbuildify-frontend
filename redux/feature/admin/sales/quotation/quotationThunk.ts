import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { quotationSetting } from './IQuotationState';

export const fetchQuotationSetting = createAsyncThunk(
  'quotation/fetchSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ quotationSettings: quotationSetting }>>(
        API_ENDPOINTS.GET_QUOTATION_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationSetting = createAsyncThunk(
  'quotation/update',
  async (payload: { data: Partial<quotationSetting>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<quotationSetting>>(
        `${API_ENDPOINTS.QUOTATION_SETTING}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
