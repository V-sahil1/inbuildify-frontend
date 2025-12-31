import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { leadSource, LeadSourceResponse } from './ILeadSourceState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createleadSource = createAsyncThunk(
  'leadSource/salescreate',
  async (payload: leadSource, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<LeadSourceResponse>>(
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ leadSource: LeadSourceResponse[]; pagination: Pagination }>
      >(API_ENDPOINTS.SALES_LEAD_SOURCE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateleadSource = createAsyncThunk(
  'leadSource/salesupdate',
  async (payload: { data: Partial<leadSource>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<LeadSourceResponse>>(
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
      const response = await api.put<ApiResponse<LeadSourceResponse>>(
        `${API_ENDPOINTS.UPDATE_LEAD_SOURCE_STATUS}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
