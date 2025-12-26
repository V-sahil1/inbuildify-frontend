import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PriceListResponse } from './IPricelistState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const fetchPricelist = createAsyncThunk(
  'pricelist/fetchPricelist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ data: PriceListResponse[]; pagination: Pagination }>
      >(API_ENDPOINTS.PRICELIST_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
