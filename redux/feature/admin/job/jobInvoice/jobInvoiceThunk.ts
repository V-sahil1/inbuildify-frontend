import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { JobInvoiceSetting, JobInvoiceStage } from './IJobInvoiceState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const fetchJobInvoiceSetting = createAsyncThunk(
  'jobInvoice/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobInvoiceSetting>>(API_ENDPOINTS.JOB_INVOICE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const updateJobInvoiceSetting = createAsyncThunk(
  'jobInvoice/update',
  async (payload: Partial<JobInvoiceSetting>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobInvoiceSetting>>(API_ENDPOINTS.JOB_INVOICE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const fetchJobInvoiceStage = createAsyncThunk(
  'JobInvoiceStage/fetch',
  async (params:{page?:number,limit?:number}={}, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ jobInvoiceStagePayments: JobInvoiceStage[],pagination:CommonPagination }>>(
        API_ENDPOINTS.JOB_INVOICE_STAGE,{params}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const createJobInvoiceStage = createAsyncThunk(
  'jobInvoiceStage/create',
  async (payload: JobInvoiceStage, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobInvoiceStage>>(
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

export const updateJobInvoiceStage = createAsyncThunk(
  'jobInvoiceStage/update',
  async (
    payload: { data: Partial<JobInvoiceStage>; jobInvoiceStagePaymentId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<JobInvoiceStage>>(
        `${API_ENDPOINTS.JOB_INVOICE_STAGE}/${payload.jobInvoiceStagePaymentId}`,
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

export const deleteJobInvoiceStage = createAsyncThunk(
  'jobInvoiceStage/delete',
  async (jobInvoiceStagePaymentId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobInvoiceStage>>(
        `${API_ENDPOINTS.JOB_INVOICE_STAGE}/${jobInvoiceStagePaymentId}`
      );
      return { jobInvoiceStagePaymentId };
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
