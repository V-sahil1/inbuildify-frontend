import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';

export const fetchSchedularSetting = createAsyncThunk(
  'schedularSetting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ receiverOfReplies: string[] } >>(
        API_ENDPOINTS.SCHEDULE_BASE
      );
      return response.data.receiverOfReplies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSchedularSetting = createAsyncThunk(
  'schedularSetting/update',
  async (payload: { receiverOfReplies: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<{ receiverOfReplies: string[] }>>(
        API_ENDPOINTS.SCHEDULE_BASE,
        { data: payload }
      );
      return response.data.receiverOfReplies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
