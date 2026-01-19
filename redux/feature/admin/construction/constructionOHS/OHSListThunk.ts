import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { OHSListCategory, OHSListSetting } from './IOHSListState';

export const updateOHSSetting = createAsyncThunk(
  'ohsSetting/create',
  async (payload: Partial<OHSListSetting>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<OHSListSetting>>(API_ENDPOINTS.OHS_SETTING, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOHSSetting = createAsyncThunk(
  'ohsSetting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<OHSListSetting>>(API_ENDPOINTS.OHS_SETTING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOHSItem = createAsyncThunk(
  'ohsItem/create',
  async (payload: OHSListCategory, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<OHSListCategory>>(API_ENDPOINTS.OHS_ITEM, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOHSItem = createAsyncThunk(
  'ohsItem/fetchAll',
  async (payload: { fieldType: string; id?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<OHSListCategory[]>>(API_ENDPOINTS.OHS_ITEM, {
        params: { field_type: payload.fieldType, id: payload.id },
      });
      return { data: response.data, fieldType: payload.fieldType, id: payload.id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOHSItem = createAsyncThunk(
  'ohsItem/update',
  async (payload: { data: Partial<OHSListCategory>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<OHSListCategory>>(
        `${API_ENDPOINTS.OHS_ITEM}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOHSItem = createAsyncThunk(
  'ohsItem/delete',
  async (payload: { id: string; parentId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.OHS_ITEM}/${payload.id}`);
      return { id: payload.id, parentId: payload.parentId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
