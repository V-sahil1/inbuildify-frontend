import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { JobColorColumnType, JobColorSection, JobColorSettings } from './IJobColorState';
import { Pagination } from '../../general/surveyor/ISurveyorState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const fetchJobColor = createAsyncThunk('jobColor/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<JobColorSettings>>(API_ENDPOINTS.JOB_COLOR);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateJobColor = createAsyncThunk(
  'jobColor/update',
  async (payload: Partial<JobColorSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobColorSettings>>(API_ENDPOINTS.JOB_COLOR, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//color column
export const fetchJobColorColumn = createAsyncThunk(
  'jobColor/fetchColorColumn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ jobColorColumn: JobColorColumnType[]; pagination: Pagination }>
      >(API_ENDPOINTS.JOB_COLOR_COLUMN);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobColorColumn = createAsyncThunk(
  'jobColor/updateColorColumn',
  async (payload: { data: Partial<JobColorColumnType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobColorColumnType>>(
        `${API_ENDPOINTS.JOB_COLOR_COLUMN}/${payload.id}`,
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

//custom section

export const fetchJobColorSection = createAsyncThunk(
  'jobColor/fetchColorSetion',
  async (params:{page?:number,limit?:number}={}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ JobColorColumnSections: JobColorSection[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.JOB_COLOR_SECTION,{params});
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const createJobColorSection = createAsyncThunk(
  'jobColor/createColorSetion',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<JobColorSection>>(
        API_ENDPOINTS.JOB_COLOR_SECTION,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobColorSection = createAsyncThunk(
  'jobColor/updateColorSetion',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<JobColorSection>>(
        `${API_ENDPOINTS.JOB_COLOR_SECTION}/${payload.id}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const deleteJobColorSection = createAsyncThunk(
  'jobColor/deleteColorSetion',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobColorSection>>(
        `${API_ENDPOINTS.JOB_COLOR_SECTION}/${id}`
      );
      return { id };
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
