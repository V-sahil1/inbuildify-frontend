import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CustomField, CustomFieldModule, CustomFieldResponse } from './ICustomFieldState';
import { Pagination } from '../surveyor/ISurveyorState';

export const createCustomField = createAsyncThunk(
  'customField/create',
  async (payload: CustomField, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomFieldResponse>>(
        API_ENDPOINTS.CUSTOMFIELD_BASE,
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

export const fetchAllCustomField = createAsyncThunk(
  'customField/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ customFields: CustomFieldResponse[]; pagination: Pagination }>
      >(API_ENDPOINTS.CUSTOMFIELD_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomField = createAsyncThunk(
  'customField/update',
  async (payload: { data: Partial<CustomField>; customFieldId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<CustomFieldResponse>>(
        `${API_ENDPOINTS.CUSTOMFIELD_BASE}/${payload.customFieldId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      return rejectWithValue(error.message);
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
      return rejectWithValue(error.message);
    }
  }
);

export const createCustomFieldListOption = createAsyncThunk(
  'customField/createOption',
  async (payload: { customFieldId: string; options: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomFieldResponse>>(
        API_ENDPOINTS.CUSTOMFIELD_LIST_OPTION_BASE,
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

export const deleteCustomFieldListOption = createAsyncThunk(
  'customField/deleteOption',
  async (payload: { customFieldId: string; options: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<CustomFieldResponse>>(
        `${API_ENDPOINTS.CUSTOMFIELD_LIST_OPTION_BASE}/${payload.customFieldId}`,
        { data: { options: payload.options } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
