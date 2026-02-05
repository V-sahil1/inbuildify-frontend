import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  CustomerFieldItem,
  CustomerFieldItemPayload,
  CustomFieldName,
  IntegrationSettings,
} from './IintegrationOptionalState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const fetchIntegrationSetting = createAsyncThunk(
  'integrationSetting/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IntegrationSettings>>(
        API_ENDPOINTS.INTEGRATION_SETTING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIntegrationSetting = createAsyncThunk(
  'integrationSetting/update',
  async (payload: Partial<IntegrationSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IntegrationSettings>>(
        API_ENDPOINTS.INTEGRATION_SETTING,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// custom filed
export const createCustomFieldHeader = createAsyncThunk(
  'customField/createField',
  async (payload: CustomFieldName, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomFieldName>>(
        API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD,
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

export const fetchAllCustomFieldHeader = createAsyncThunk(
  'customField/fetchAllField',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ integrationCustomFieldHeaders: CustomFieldName[]; pagination: Pagination }>
      >(API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomFieldHeader = createAsyncThunk(
  'customField/updateField',
  async (payload: { data: Partial<CustomFieldName>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<CustomFieldName>>(
        `${API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomFieldHeader = createAsyncThunk(
  'customField/deleteField',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//custom field item

export const createCustomFieldItem = createAsyncThunk(
  'customField/createFieldItem',
  async (payload: CustomerFieldItemPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CustomerFieldItem>>(
        API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD_ITEM,
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

export const fetchAllCustomFieldItem = createAsyncThunk(
  'customField/fetchAllFieldItem',
  async (params:{page?:number,limit?:number}={}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ items: CustomerFieldItem[]; pagination: Pagination }>
      >(API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD_ITEM,{params});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomFieldItem = createAsyncThunk(
  'customField/updateFieldItem',
  async (payload: { data: Partial<CustomerFieldItemPayload>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<CustomerFieldItem>>(
        `${API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD_ITEM}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomFieldItem = createAsyncThunk(
  'customField/deleteFieldItem',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.INTEGRATION_CUSTOM_FIELD_ITEM}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
