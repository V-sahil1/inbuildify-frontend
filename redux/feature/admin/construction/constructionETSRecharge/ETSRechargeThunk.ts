import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { Pagination } from '../../general/surveyor/ISurveyorState';
import { ETSRechargeItem, IETSRechargeSetting } from './ETSRechargeState';

export const updateETSRechargeSetting = createAsyncThunk(
  'etsRecharge/create',
  async (payload: Partial<IETSRechargeSetting>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IETSRechargeSetting>>(
        API_ENDPOINTS.ETS_RECHARGE_SETTING,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchETSRechargeSetting = createAsyncThunk(
  'etsRecharge/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IETSRechargeSetting>>(
        API_ENDPOINTS.ETS_RECHARGE_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createETSRehargeItem = createAsyncThunk(
  'etsRehargeItem/create',
  async (payload: ETSRechargeItem, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ETSRechargeItem>>(
        API_ENDPOINTS.ETS_RECHARGE_APPROVAL,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllETSRehargeItem = createAsyncThunk(
  'etsRehargeItem/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ approvals: ETSRechargeItem[]; pagination: Pagination }>
      >(API_ENDPOINTS.ETS_RECHARGE_APPROVAL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateETSRehargeItem = createAsyncThunk(
  'etsRehargeItem/update',
  async (payload: { data: Partial<ETSRechargeItem>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ETSRechargeItem>>(
        `${API_ENDPOINTS.ETS_RECHARGE_APPROVAL}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteETSRehargeItem = createAsyncThunk(
  'etsRehargeItem/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.ETS_RECHARGE_APPROVAL}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
