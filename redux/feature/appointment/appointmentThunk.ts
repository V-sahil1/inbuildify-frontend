import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { IAppointment } from './IAppointmentState';

export const createAppointment = createAsyncThunk(
  'appointment/create',
  async (payload: IAppointment, { rejectWithValue }) => {
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{appointment:IAppointment[]}>>(API_ENDPOINTS.APPOINTMENT);
      return response.data;
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
      await api.delete<ApiResponse>(`${API_ENDPOINTS.APPOINTMENT}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
