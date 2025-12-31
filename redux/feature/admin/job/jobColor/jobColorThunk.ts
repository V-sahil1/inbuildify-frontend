import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { JobColorSettings } from './IJobColorState';

export const fetchJobColor = createAsyncThunk(
  'jobColor/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobColorSettings>>(API_ENDPOINTS.JOB_COLOR);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobColor = createAsyncThunk(
  'jobColor/update',
  async (payload: Partial<JobColorSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobColorSettings>>(
        API_ENDPOINTS.JOB_COLOR,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);