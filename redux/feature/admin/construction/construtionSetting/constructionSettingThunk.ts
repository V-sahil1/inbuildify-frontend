import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { ConstructionSetting } from './iconstructionSettingState';

export const fetchConstructionSetting = createAsyncThunk(
  'constructionSetting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ConstructionSetting>>(
        API_ENDPOINTS.CONSTRUCTION_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateConstructionSetting = createAsyncThunk(
  'constructionSetting/update',
  async (data: Partial<ConstructionSetting>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ConstructionSetting>>(
        API_ENDPOINTS.CONSTRUCTION_SETTING,
        { data: data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
