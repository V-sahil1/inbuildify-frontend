import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Pagination } from '../admin/general/surveyor/ISurveyorState';
import { ApiResponse } from '../auth/IAuthState';
import {
  ContractFormatType,
  ContractFormatFilterPayload,
  ContractFormatSectionType,
} from './IContractFormatState';

export const createContractFormat = createAsyncThunk(
  'contractFormat/create',
  async (payload: ContractFormatType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ContractFormatType>>(
        API_ENDPOINTS.CONTRACT_FORMAT,
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

export const fetchAllContractFormat = createAsyncThunk(
  'contractFormat/fetchAll',
  async (params: ContractFormatFilterPayload, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ contractFormats: ContractFormatType[]; pagination: Pagination }>
      >(API_ENDPOINTS.CONTRACT_FORMAT, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllContractFormatById = createAsyncThunk(
  'contractFormat/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ContractFormatType>>(
        API_ENDPOINTS.CONTRACT_FORMAT + '/' + id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContractFormat = createAsyncThunk(
  'contractFormat/update',
  async (payload: { data: Partial<ContractFormatType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ContractFormatType>>(
        `${API_ENDPOINTS.CONTRACT_FORMAT}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContractFormat = createAsyncThunk(
  'contractFormat/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<ContractFormatType>>(
        `${API_ENDPOINTS.CONTRACT_FORMAT}/${id}`
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createContractFormatSection = createAsyncThunk(
  'contractFormat/createSection',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<ContractFormatSectionType>>(
        API_ENDPOINTS.CONTRACT_FORMAT_SECTION,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllContractFormatSection = createAsyncThunk(
  'contractFormat/fetchAllSection',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ contractSections: ContractFormatSectionType[]; pagination: Pagination }>
      >(API_ENDPOINTS.CONTRACT_FORMAT_SECTION, { params: { contract_format_id: id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContractFormatSection = createAsyncThunk(
  'contractFormat/updateSection',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<ContractFormatSectionType>>(
        `${API_ENDPOINTS.CONTRACT_FORMAT_SECTION}/${payload.id}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContractFormatSection = createAsyncThunk(
  'contractFormat/deleteSection',
  async (payload: { id: string; contractFormatId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONTRACT_FORMAT_SECTION}/${payload.id}`
      );
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
