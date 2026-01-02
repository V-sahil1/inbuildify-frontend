import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  jobVariationApproval,
  jobVariationApprovalResponse,
  JobVariationSetting,
} from './IJobVariationState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const fetchJobVariationSetting = createAsyncThunk(
  'jobVariationSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobVariationSetting>>(API_ENDPOINTS.JOB_VARIATION);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const updateJobVariationSetting = createAsyncThunk(
  'jobVariationSetting/update',
  async (payload: Partial<JobVariationSetting>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobVariationSetting>>(
        API_ENDPOINTS.JOB_VARIATION,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const fetchJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{
          jobVariationApproval: jobVariationApprovalResponse[];
          pagination: Pagination;
        }>
      >(API_ENDPOINTS.JOB_VARIATION_APPROVAL);
      return response.data.jobVariationApproval;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const createJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/create',
  async (payload: jobVariationApproval, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<jobVariationApprovalResponse>>(
        API_ENDPOINTS.JOB_VARIATION_APPROVAL,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/update',
  async (payload: { data: Partial<jobVariationApproval>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<jobVariationApprovalResponse>>(
        `${API_ENDPOINTS.JOB_VARIATION_APPROVAL}/${payload.id}`,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const deleteJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/delete',
  async (jobVariationApprovalId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.JOB_VARIATION_APPROVAL}/${jobVariationApprovalId}`
      );
      return { jobVariationApprovalId };
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
