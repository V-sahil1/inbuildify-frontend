import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CommonPagination } from '@redux/feature/common/ICommonState';
import { LeadSourceType } from './ILeadSourceState';

export const createleadSource = createAsyncThunk(
  'leadSource/salescreate',
  async (payload: LeadSourceType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<LeadSourceType>>(
        API_ENDPOINTS.SALES_LEAD_SOURCE,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllleadSource = createAsyncThunk(
  'leadSource/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ leadSource: LeadSourceType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.SALES_LEAD_SOURCE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateleadSource = createAsyncThunk(
  'leadSource/salesupdate',
  async (payload: { data: Partial<LeadSourceType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<LeadSourceType>>(
        `${API_ENDPOINTS.SALES_LEAD_SOURCE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateleadSourceStatus = createAsyncThunk(
  'leadSource/updateStatus',
  async (payload: { data: { isActive: boolean }; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<LeadSourceType>>(
        `${API_ENDPOINTS.UPDATE_LEAD_SOURCE_STATUS}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
