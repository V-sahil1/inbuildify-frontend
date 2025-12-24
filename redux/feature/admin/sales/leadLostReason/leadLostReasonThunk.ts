import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  fetchLeadLostReasonResponse,
  leadLostReason,
  leadLostReasonResponse,
} from './ILeadLostReasonState';

export const createLeadLostReason = createAsyncThunk(
  'leadLostReason/create',
  async (payload: leadLostReason, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<leadLostReasonResponse>>(
        API_ENDPOINTS.LEAD_LOST_REASON,
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

export const fetchAllLeadLostReason = createAsyncThunk(
  'leadLostReason/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<fetchLeadLostReasonResponse>>(
        API_ENDPOINTS.LEAD_LOST_REASON
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLeadLostReason = createAsyncThunk(
  'leadLostReason/update',
  async (payload: { data: Partial<leadLostReason>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<leadLostReasonResponse>>(
        `${API_ENDPOINTS.LEAD_LOST_REASON}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLeadLostReasonStatus = createAsyncThunk(
  'leadLostReason/updateStatus',
  async (payload: { data: { isActive: boolean }; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<leadLostReasonResponse>>(
        `${API_ENDPOINTS.UPDATE_LEAD_LOST_REASON}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
