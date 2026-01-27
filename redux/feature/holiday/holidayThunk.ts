import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { CommonPagination } from '../common/ICommonState';
import { IHoliday, IHolidayFetchParams, IRecalculateDateSettings } from './IHolidayState';

export const fetchHolidayRealculateDate = createAsyncThunk(
  'holiday/fetchHolidayRealculateDate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IRecalculateDateSettings>>(
        API_ENDPOINTS.HOLIDAY_RECALCULATE_DATE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHolidayRealculateDate = createAsyncThunk(
  'holiday/updateHolidayRealculateDate',
  async (data: Partial<IRecalculateDateSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IRecalculateDateSettings>>(
        `${API_ENDPOINTS.HOLIDAY_RECALCULATE_DATE}`,
        { data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createHoliday = createAsyncThunk(
  'holiday/create',
  async (payload: IHoliday, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IHoliday>>(API_ENDPOINTS.HOLIDAY, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllHoliday = createAsyncThunk(
  'holiday/fetchAll',
  async (params: IHolidayFetchParams, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ holidays: IHoliday[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.HOLIDAY, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHoliday = createAsyncThunk(
  'holiday/update',
  async (payload: { data: Partial<IHoliday>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IHoliday>>(
        `${API_ENDPOINTS.HOLIDAY}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  'holiday/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.HOLIDAY}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
