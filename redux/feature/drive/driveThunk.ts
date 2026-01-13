import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { CommonPagination } from '../common/ICommonState';
import { IDrive } from './IDriveState';

export const fetchDrive = createAsyncThunk(
  'drive/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ drives: IDrive[],pagination: CommonPagination}>>(
        API_ENDPOINTS.DRIVE_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);