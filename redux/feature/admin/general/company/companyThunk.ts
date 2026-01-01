import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CompanyInfo } from './icompanyState';

export const fetchCompanyInfo = createAsyncThunk(
  'companyInfo/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<CompanyInfo>>(
        API_ENDPOINTS.COMPANY_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompanyDetails = createAsyncThunk(
  'companyInfo/update',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<CompanyInfo>>(
        API_ENDPOINTS.COMPANY_BASE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
