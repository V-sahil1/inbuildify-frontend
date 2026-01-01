import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CommissionStage, JobCommission, jobCommissionSetting } from './IJobCommissionState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

//setting
export const fetchJobCommissionSetting = createAsyncThunk(
  'jobCommission/fetchSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<jobCommissionSetting>>(
        API_ENDPOINTS.JOB_COMMISSION_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobCommissionSetting = createAsyncThunk(
  'jobCommission/updateSetting',
  async (payload: Partial<jobCommissionSetting>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<jobCommissionSetting>>(
        API_ENDPOINTS.JOB_COMMISSION_SETTING,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//incoming commission
export const fetchAllIncomingCommission = createAsyncThunk(
  'jobCommission/fetchAllOutgoingCommission',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ jobCommission: JobCommission[]; pagination: Pagination }>
      >(API_ENDPOINTS.JOB_COMMISSION, { params: { commissionType: 'incoming' } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//outgoing ccommission
export const createOutgoingCommission = createAsyncThunk(
  'jobCommission/createOutgoingCommission',
  async (payload: JobCommission, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobCommission>>(API_ENDPOINTS.JOB_COMMISSION, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOutgoingCommission = createAsyncThunk(
  'jobCommission/fetchAllOutgoingCommission',
  async (payload: { commission_type: 'incoming' | 'outgoing' }, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ jobCommission: JobCommission[]; pagination: Pagination }>
      >(API_ENDPOINTS.JOB_COMMISSION, { params: payload });
      return { data: response.data, ...payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOutgoingCommission = createAsyncThunk(
  'jobCommission/updateOutgoingCommission   ',
  async (
    payload: { data: Partial<JobCommission>; id: string; commissionType: 'incoming' | 'outgoing' },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<JobCommission>>(
        `${API_ENDPOINTS.JOB_COMMISSION}/${payload.id}`,
        { data: payload.data }
      );
      return { data: response.data, commissionType: payload.commissionType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOutgoingCommission = createAsyncThunk(
  'jobCommission/deleteOutgoingCommission',
  async (payload: { id: string; commissionType: 'incoming' | 'outgoing' }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.JOB_COMMISSION}/${payload.id}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//outgoing ccommission
export const createCommissionStage = createAsyncThunk(
  'jobCommission/createCommissionStage',
  async (payload: CommissionStage, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CommissionStage>>(
        API_ENDPOINTS.JOB_COMMISSION_SUB_STAGE,
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

export const fetchAllCommissionStage = createAsyncThunk(
  'jobCommission/fetchAllCommissionStage',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ records: CommissionStage[]; pagination: Pagination }>
      >(`${API_ENDPOINTS.JOB_COMMISSION_SUB_STAGE}/${id}`);
      return { data: response.data, pagination: response.pagination, id: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommissionStage = createAsyncThunk(
  'jobCommission/updateCommissionStage',
  async (
    payload: { data: Partial<CommissionStage>; id: string; commissionId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<CommissionStage>>(
        `${API_ENDPOINTS.JOB_COMMISSION_SUB_STAGE}/${payload.id}`,
        { data: payload.data }
      );
      return { data: response.data, commissionId: payload.commissionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCommissionStage = createAsyncThunk(
  'jobCommission/deleteCommissionStage',
  async (payload: { id: string; commissionId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.JOB_COMMISSION_SUB_STAGE}/${payload.id}`
      );
      return { id: payload.id, commissionId: payload.commissionId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
