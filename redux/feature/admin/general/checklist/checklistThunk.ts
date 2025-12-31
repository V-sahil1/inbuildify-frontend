import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  checklist,
  checklistItem,
  ChecklistItemResponse,
  ChecklistResponse,
} from './IChecklistState';
import { Pagination } from '../surveyor/ISurveyorState';

export const createChecklist = createAsyncThunk(
  'checklist/create',
  async (payload: checklist, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ChecklistResponse>>(
        API_ENDPOINTS.CHECKLIST_BASE,
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

export const fetchAllChecklist = createAsyncThunk(
  'checklist/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ checklist: ChecklistResponse[]; pagination: Pagination }>
      >(API_ENDPOINTS.CHECKLIST_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChecklist = createAsyncThunk(
  'checklist/update',
  async (payload: { data: Partial<checklist>; checklistId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ChecklistResponse>>(
        `${API_ENDPOINTS.CHECKLIST_BASE}/${payload.checklistId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChecklist = createAsyncThunk(
  'checklist/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.CHECKLIST_BASE}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChecklistItem = createAsyncThunk(
  'checklistItem/create',
  async (payload: checklistItem, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ChecklistItemResponse>>(
        API_ENDPOINTS.CHECKLIST_ITEM,
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

export const fetchAllChecklistItem = createAsyncThunk(
  'checklistItem/fetchAll',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ChecklistItemResponse[]>>(
        `${API_ENDPOINTS.CHECKLIST_ITEM}/${payload}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChecklistItem = createAsyncThunk(
  'checklistItem/update',
  async (payload: { data: Partial<checklistItem>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ChecklistItemResponse>>(
        `${API_ENDPOINTS.CHECKLIST_ITEM}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChecklistItem = createAsyncThunk(
  'checklistItem/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.CHECKLIST_ITEM}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
