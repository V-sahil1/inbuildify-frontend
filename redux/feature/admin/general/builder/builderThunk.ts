import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { BuilderInfo } from './ibuilderState';

export const fetchBuilderInfo = createAsyncThunk(
  'builderInfo/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<BuilderInfo>>(API_ENDPOINTS.BUILDER_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBuilderDetails = createAsyncThunk(
  'builderInfo/update',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<BuilderInfo>>(
        API_ENDPOINTS.BUILDER_BASE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
