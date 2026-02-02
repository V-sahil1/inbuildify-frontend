import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CustomField, CustomFieldModule } from './ICustomFieldState';
import { Pagination } from '../surveyor/ISurveyorState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const createCustomField = createAsyncThunk(
  'customField/create',
  async (payload: CustomField, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomField>>(API_ENDPOINTS.CUSTOMFIELD_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const fetchAllCustomField = createAsyncThunk(
  'customField/fetchAll',
  async (
    params: { module_id?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<
        ApiResponse<{ customFields: CustomField[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.CUSTOMFIELD_BASE, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const updateCustomField = createAsyncThunk(
  'customField/update',
  async (payload: { data: Partial<CustomField>; customFieldId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<CustomField>>(
        `${API_ENDPOINTS.CUSTOMFIELD_BASE}/${payload.customFieldId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const deleteCustomField = createAsyncThunk(
  'customField/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CUSTOMFIELD_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const fetchAllCustomFieldModule = createAsyncThunk(
  'customField/fetchAllModule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ customFieldModules: CustomFieldModule[]; pagination: Pagination }>
      >(API_ENDPOINTS.CUSTOMFIELD_MODULE_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const createCustomFieldListOption = createAsyncThunk(
  'customField/createOption',
  async (payload: { customFieldId: string; options: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomField>>(
        API_ENDPOINTS.CUSTOMFIELD_LIST_OPTION_BASE,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const deleteCustomFieldListOption = createAsyncThunk(
  'customField/deleteOption',
  async (payload: { customFieldId: string; options: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<CustomField>>(
        `${API_ENDPOINTS.CUSTOMFIELD_LIST_OPTION_BASE}/${payload.customFieldId}`,
        { data: { options: payload.options } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
