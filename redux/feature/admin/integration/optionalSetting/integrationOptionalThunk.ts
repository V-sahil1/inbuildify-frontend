import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { IntegrationSettings } from './IintegrationOptionalState';

export const fetchIntegrationSetting = createAsyncThunk(
  'integrationSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IntegrationSettings>>(API_ENDPOINTS.INTEGRATION_SETTING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIntegrationSetting = createAsyncThunk(
  'integrationSetting/update',
  async (payload: Partial<IntegrationSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IntegrationSettings>>(
        API_ENDPOINTS.INTEGRATION_SETTING,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);