import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { MaintenanceSettings } from './IMaintenanceSettingState';

export const fetchMaintenanceSetting = createAsyncThunk(
  'maintenanceSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<MaintenanceSettings>>(API_ENDPOINTS.MAINTENANCE_SETTING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMaintenanceSetting = createAsyncThunk(
  'maintenanceSetting/update',
  async (payload: Partial<MaintenanceSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<MaintenanceSettings>>(
        API_ENDPOINTS.MAINTENANCE_SETTING,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);