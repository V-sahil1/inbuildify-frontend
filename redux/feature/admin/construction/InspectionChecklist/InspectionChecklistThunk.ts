import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { InspectionChecklistType } from './InspectionChecklistState';

export const createInspectionChecklist = createAsyncThunk(
  'inspectionChecklist/create',
  async (payload: InspectionChecklistType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<InspectionChecklistType>>(
        API_ENDPOINTS.INSPECTION_CHECKLIST,
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

export const fetchAllInspectionSection = createAsyncThunk(
  'inspectionChecklist/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<InspectionChecklistType[]>>(
        API_ENDPOINTS.INSPECTION_CHECKLIST,
        {
          params: {
            field_name: 'section',
          },
        }
      );
      return { data: response.data, fieldName: 'section' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllInspectionChecklist = createAsyncThunk(
  'inspectionChecklist/fetchAllChecklist',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<InspectionChecklistType[]>>(
        `${API_ENDPOINTS.INSPECTION_CHECKLIST}/${id}`
      );
      return { data: response.data, fieldName: 'checklist', id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInspectionChecklist = createAsyncThunk(
  'inspectionChecklist/update',
  async (
    payload: {
      data: Partial<InspectionChecklistType>;
      id: string;
      sectionId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<InspectionChecklistType>>(
        `${API_ENDPOINTS.INSPECTION_CHECKLIST}/${payload.id}`,
        { data: payload.data }
      );
      return { data: response.data, sectionId: payload.sectionId || null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInspectionChecklist = createAsyncThunk(
  'inspectionChecklist/delete',
  async (
    payload: { id: string; sectionId: string; fieldName: string; allowExistingJob: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.INSPECTION_CHECKLIST}/${payload.fieldName === 'section' ? payload.sectionId : payload.id}`,
        { data: { addAllExistingJobs: payload.allowExistingJob } }
      );
      return {
        id: payload.id || null,
        sectionId: payload.sectionId || null,
        fieldName: payload.fieldName,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
