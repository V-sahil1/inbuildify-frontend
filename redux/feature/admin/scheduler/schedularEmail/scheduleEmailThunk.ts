import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { ScheduleEmail } from './ischeduleEmailState';

export const fetchAllScheduleEmail = createAsyncThunk(
  'scheduleEmail/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ScheduleEmail[]>>(
        API_ENDPOINTS.SCHEDULER_EMAIL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateScheduleEmail = createAsyncThunk(
  'scheduleEmail/update',
  async (payload: { data: FormData; schedulerEmailId: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<ScheduleEmail>>(
        `${API_ENDPOINTS.SCHEDULER_EMAIL}/${payload.schedulerEmailId}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateScheduleEmailActive = createAsyncThunk(
  'scheduleEmailActive/update',
  async (schedulerEmailId: string, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ScheduleEmail>>(
        `${API_ENDPOINTS.SCHEDULER_EMAIL_ACTIVE}/${schedulerEmailId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
