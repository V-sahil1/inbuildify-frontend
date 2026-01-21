import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { ICostCenter } from './IcostCenterState';

export const fetchAllCostCenter = createAsyncThunk(
  'costCenter/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ICostCenter[]>>(API_ENDPOINTS.COST_CENTER);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
