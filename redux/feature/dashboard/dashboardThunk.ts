import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
import { DashboardData, SalesDashboardStats } from './dashboardState';

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

export const getSalesDashboardThunk = createAsyncThunk(
  'dashboard/getSalesDashboard',
  async (
    params: {
      user_id?: string;
      created_at?: string;
      created_at_from?: string;
      created_at_to?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<SalesDashboardStats> = await api.get(
        API_ENDPOINTS.SALES_DASHBOARD_STATS(params)
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const refreshWidgetsCacheThunk = createAsyncThunk(
  'dashboard/refreshWidgetsCache',
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Record<string, never>> = await api.post(
        API_ENDPOINTS.REFRESH_WIDGETS_CACHE,
        { data: {} }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
