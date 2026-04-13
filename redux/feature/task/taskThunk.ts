import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { ITask, ITaskCounters, TaskQueryParams } from './ITaskStates';
import { CommonPagination } from '../common/ICommonState';

export const createTask = createAsyncThunk(
  'task/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<ITask>>(
        API_ENDPOINTS.TASK_BASE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllTask = createAsyncThunk(
  'task/fetchAll',
  async (params: TaskQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ tasks: ITask[]; pagination: CommonPagination; counters: ITaskCounters }>
      >(API_ENDPOINTS.TASK_BASE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/update',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ITask>>(
        `${API_ENDPOINTS.TASK_BASE}/${payload.id}`,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponse>(`${API_ENDPOINTS.TASK_BASE}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
