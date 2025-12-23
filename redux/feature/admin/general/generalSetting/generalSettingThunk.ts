import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { GeneralSetting, GeneralSettingResponse } from './igeneralSettingState';

export const fetchGeneralSetting = createAsyncThunk(
  'generalSetting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<GeneralSettingResponse>>(
        API_ENDPOINTS.GET_GENERAL_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGeneralSetting = createAsyncThunk(
  'generalSetting/update',
  async (payload: { data: Partial<GeneralSetting>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<GeneralSettingResponse>>(
        `${API_ENDPOINTS.GENERAL_SETTING}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
