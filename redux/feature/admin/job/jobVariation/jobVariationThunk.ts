import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { jobVariationLimit, JobVariationSetting } from './IJobVariationState';


export const fetchJobVariationSetting = createAsyncThunk(
  'jobVariationSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobVariationSetting>>(API_ENDPOINTS.JOB_INVOICE);
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
      const response = await api.put<ApiResponse<JobVariationSetting>>(API_ENDPOINTS.JOB_INVOICE, {
        data: payload,
      });
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
      const response = await api.get<ApiResponse<{ jobInvoiceStagePayments: jobVariationLimit[] }>>(
        API_ENDPOINTS.JOB_INVOICE_STAGE
      );
      return response.data.jobInvoiceStagePayments;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const createJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/create',
  async (payload: jobVariationLimit, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<jobVariationLimit>>(
        API_ENDPOINTS.JOB_INVOICE_STAGE,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobVariationLimit = createAsyncThunk(
  'jobVariationLimit/update',
  async (
    payload: { data: Partial<jobVariationLimit>; jobVariationLimitId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<jobVariationLimit>>(
        `${API_ENDPOINTS.JOB_INVOICE_STAGE}/${payload.jobVariationLimitId}`,
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
  async (jobVariationLimitId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<jobVariationLimit>>(
        `${API_ENDPOINTS.JOB_INVOICE_STAGE}/${jobVariationLimitId}`
      );
      return { jobVariationLimitId };
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
