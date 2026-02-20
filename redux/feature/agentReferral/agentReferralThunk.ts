import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { IAgentReferralPartner } from './IAgentReferralState';

export const createAgentReferral = createAsyncThunk(
  'agentReferral/create',
  async (payload: IAgentReferralPartner, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IAgentReferralPartner>>(
        API_ENDPOINTS.AGENT_REFERRAL,
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

export const fetchAllAgentReferral = createAsyncThunk(
  'agentReferral/fetchAll',
  async (params: { search?: string; is_active?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IAgentReferralPartner[]>>(
        API_ENDPOINTS.AGENT_REFERRAL,
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAgentReferral = createAsyncThunk(
  'agentReferral/update',
  async (payload: { data: Partial<IAgentReferralPartner>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IAgentReferralPartner>>(
        `${API_ENDPOINTS.AGENT_REFERRAL}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAgentReferral = createAsyncThunk(
  'agentReferral/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponse>(`${API_ENDPOINTS.AGENT_REFERRAL}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
