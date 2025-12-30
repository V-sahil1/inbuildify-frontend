import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { MaintenanceArea } from './IMaintenanceAreaState';

export const fetchMaintenanceArea = createAsyncThunk(
  'maintenanceArea/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ maintenanceArea: MaintenanceArea[] }>>(
        API_ENDPOINTS.MAINTENANCE_AREA
      );
      return response.data.maintenanceArea;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMaintenanceArea = createAsyncThunk(
  'maintenanceArea/create',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<MaintenanceArea>>(
        API_ENDPOINTS.MAINTENANCE_AREA,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMaintenanceArea = createAsyncThunk(
  'maintenanceArea/update',
  async (payload: { maintenanceAreaId: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<MaintenanceArea>>(
        `${API_ENDPOINTS.MAINTENANCE_AREA}/${payload.maintenanceAreaId}`,
        {
          data: { name: payload.name },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMaintenanceArea = createAsyncThunk(
  'maintenanceArea/delete',
  async (maintenanceAreaId: string, { rejectWithValue }) => {
    try {
      if (String(maintenanceAreaId).startsWith('new-')) {
        return maintenanceAreaId;
      }
      await api.delete(`${API_ENDPOINTS.MAINTENANCE_AREA}/${maintenanceAreaId}`);
      return maintenanceAreaId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
