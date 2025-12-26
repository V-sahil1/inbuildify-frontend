import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HLPackageSettings } from './IhlPackageState';

export const fetchhlPackageSetting = createAsyncThunk(
  'hlPackage/fetchSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ houseLandPackageSettings: HLPackageSettings }>>(
        API_ENDPOINTS.GET_HL_PACKAGE_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatehlPackageSetting = createAsyncThunk(
  'hlPackage/update',
  async (
    payload: { data: { includeFacadeCostInTotal: boolean }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<HLPackageSettings>>(
        `${API_ENDPOINTS.HL_PACKAGE_SETTING}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
