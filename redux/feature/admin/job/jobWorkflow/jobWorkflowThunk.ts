import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { JobWorkflow } from './IJobWorkflowState';

export const fetchJobWorkflow = createAsyncThunk(
  'jobWorkflow/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobWorkflow>>(API_ENDPOINTS.JOB_WORKFLOW);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobWorkflow = createAsyncThunk(
  'jobWorkflow/update',
  async (payload: Partial<JobWorkflow>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobWorkflow>>(
        API_ENDPOINTS.JOB_WORKFLOW,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);