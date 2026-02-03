import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { LeadLostReasonType } from './ILeadLostReasonState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const createLeadLostReason = createAsyncThunk(
  'leadLostReason/create',
  async (payload: LeadLostReasonType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<LeadLostReasonType>>(
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
  async (params:{page?:number,limit?:number}={}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ leadLostReason: LeadLostReasonType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.LEAD_LOST_REASON,{params});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLeadLostReason = createAsyncThunk(
  'leadLostReason/update',
  async (payload: { data: Partial<LeadLostReasonType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<LeadLostReasonType>>(
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
      const response = await api.put<ApiResponse<LeadLostReasonType>>(
        `${API_ENDPOINTS.UPDATE_LEAD_LOST_REASON}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
