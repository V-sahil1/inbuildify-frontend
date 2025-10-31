import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
import { DashboardData } from './dashboardState';

export const getDashboardThunk = createAsyncThunk(
  'dashboard/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<DashboardData> = await api.get(API_ENDPOINTS.DASHBOARD_BASE);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
