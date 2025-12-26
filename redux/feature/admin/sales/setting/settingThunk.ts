import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setting, settingResponse } from './ISettingState';

export const fetchSetting = createAsyncThunk(
  'setting/fetchSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ salesModuleSettings: settingResponse }>>(
        API_ENDPOINTS.GET_SALES_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSetting = createAsyncThunk(
  'setting/update',
  async (payload: { data: Partial<setting>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<settingResponse>>(
        `${API_ENDPOINTS.SALES_SETTING}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
