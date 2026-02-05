import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProcessType, StageType, StageTypePayload } from './IProcessState';

export const createProcess = createAsyncThunk(
  'process/createProcess',
  async (payload: ProcessType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ProcessType>>(API_ENDPOINTS.SALES_PROCESS, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProcess = createAsyncThunk(
  'process/fetchAllProcess',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<ProcessType[]>
      >(API_ENDPOINTS.SALES_PROCESS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProcess = createAsyncThunk(
  'process/updateProcess',
  async (payload: { data: Partial<ProcessType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ProcessType>>(
        `${API_ENDPOINTS.SALES_PROCESS}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProcess = createAsyncThunk(
  'process/deleteProcess',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.SALES_PROCESS}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//stages
export const createStage = createAsyncThunk(
  'salesStage/create',
  async (payload: StageTypePayload, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<StageType>>(API_ENDPOINTS.SALES_STAGE_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllStage = createAsyncThunk(
  'salesStage/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<StageType[]>>(
        API_ENDPOINTS.GET_SALES_STAGE_BY_PROCCESSID,
        { params: { sales_process_id: id } }
      );
      return { data: response.data, salesProcessId: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStage = createAsyncThunk(
  'salesStage/update',
  async (payload: { data: Partial<StageTypePayload>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<StageType>>(
        `${API_ENDPOINTS.SALES_STAGE_BASE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStage = createAsyncThunk(
  'salesStage/delete',
  async (payload: { processId: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.SALES_STAGE_BASE}/${payload.id}`
      );
      return { id: payload.id, salesProcessId: payload.processId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFunctionality = createAsyncThunk(
  'stage/fetchAllFunctinality',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ functionalityId: string; name: string }[]>>(
        API_ENDPOINTS.SALES_STAGE_FUNCTIONALITY
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
