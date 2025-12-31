import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { JobSettings } from './IJobSettingState';

export const fetchJobSetting = createAsyncThunk(
  'jobSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobSettings>>(API_ENDPOINTS.JOB_SETTING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobSetting = createAsyncThunk(
  'jobSetting/update',
  async (payload: Partial<JobSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobSettings>>(
        API_ENDPOINTS.JOB_SETTING,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);