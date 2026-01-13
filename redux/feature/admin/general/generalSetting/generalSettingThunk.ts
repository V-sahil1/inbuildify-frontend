import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { GeneralSetting } from './igeneralSettingState';

export const fetchGeneralSetting = createAsyncThunk(
  'generalSetting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<GeneralSetting>>(
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
      const response = await api.put<ApiResponse<GeneralSetting>>(API_ENDPOINTS.GENERAL_SETTING, {
        data: payload.data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
