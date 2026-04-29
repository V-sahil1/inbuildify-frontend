import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { IAppointment, IAppointmentPagination, IAppointmentTabCounts } from './IAppointmentState';

export interface FetchAppointmentParams {
  page?: number;
  limit?: number;
  title?: string;
  locationText?: string;
  date_from?: string;
  date_to?: string;
  lead_id?: string;
  assignee_id?: string;
  include_cancelled?: boolean;
  is_deleted?: boolean;
}

export interface FetchTabCountsParams {
  anchor_date?: string;
  title?: string;
  assignee_id?: string;
  include_cancelled?: boolean;
}

export interface FetchAppointmentResponse {
  appointment: IAppointment[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

export const createAppointment = createAsyncThunk(
  'appointment/create',
  async (payload: Partial<IAppointment>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IAppointment>>(API_ENDPOINTS.APPOINTMENT, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllAppointment = createAsyncThunk(
  'appointment/fetchAll',
  async (params: FetchAppointmentParams, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<FetchAppointmentResponse>>(
        API_ENDPOINTS.APPOINTMENT,
        { params: { ...params, is_deleted: true } }
      );
      // Backend returns "currenPage" (typo) — normalise to currentPage
      const data = response.data as any;
      return {
        appointment: data.appointment ?? [],
        totalRecords: data.totalRecords ?? 0,
        currentPage: data.currentPage ?? data.currenPage ?? params.page ?? 1,
        totalPages: data.totalPages ?? 1,
      } as FetchAppointmentResponse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointment/update',
  async (payload: { data: Partial<IAppointment>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IAppointment>>(
        `${API_ENDPOINTS.APPOINTMENT}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointment/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.APPOINTMENT}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAppointmentTabCounts = createAsyncThunk(
  'appointment/fetchTabCounts',
  async (params: FetchTabCountsParams, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IAppointmentTabCounts>>(
        API_ENDPOINTS.APPOINTMENT_TAB_COUNTS,
        { params }
      );
      return response.data as IAppointmentTabCounts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
