import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { Pagination } from '../surveyor/ISurveyorState';
import { ChecklistItemType, ChecklistType } from './IChecklistState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const createChecklist = createAsyncThunk(
  'checklist/create',
  async (payload: ChecklistType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ChecklistType>>(API_ENDPOINTS.CHECKLIST_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllChecklist = createAsyncThunk(
  'checklist/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ checklist: ChecklistType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.CHECKLIST_BASE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChecklist = createAsyncThunk(
  'checklist/update',
  async (payload: { data: Partial<ChecklistType>; checklistId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ChecklistType>>(
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
  async (payload: ChecklistItemType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ChecklistItemType>>(
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
      const response = await api.get<ApiResponse<ChecklistItemType[]>>(
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
  async (payload: { data: Partial<ChecklistItemType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ChecklistItemType>>(
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
