import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { screenTypeResponse } from './IScreenState';

export const fetchAllScreen = createAsyncThunk(
  'screen/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<screenTypeResponse[]>>(API_ENDPOINTS.SCREEN_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
