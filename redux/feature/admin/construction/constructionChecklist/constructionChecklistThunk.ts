import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  ConstructionChecklistType,
  IConstructionChecklistPredecessor,
  IConstructionSubChecklist,
} from './IConstructionChecklistState';

// checklist
export const createConstructionChecklist = createAsyncThunk(
  'ConstructionChecklist/create',
  async (payload: ConstructionChecklistType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ConstructionChecklistType>>(
        API_ENDPOINTS.CONSTRUCTION_CHECKLIST,
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

export const fetchAllConstructionChecklist = createAsyncThunk(
  'ConstructionChecklist/fetchAll',
  async (params: { builder?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ConstructionChecklistType[]>>(
        API_ENDPOINTS.CONSTRUCTION_CHECKLIST,
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateConstructionChecklist = createAsyncThunk(
  'ConstructionChecklist/update',
  async (
    payload: {
      data: Partial<ConstructionChecklistType>;
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<ConstructionChecklistType>>(
        `${API_ENDPOINTS.CONSTRUCTION_CHECKLIST}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteConstructionChecklist = createAsyncThunk(
  'ConstructionChecklist/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_CHECKLIST}/${id}`
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// subchecklist
export const createSubChecklist = createAsyncThunk(
  'SubChecklist/create',
  async (payload: IConstructionSubChecklist, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IConstructionSubChecklist>>(
        API_ENDPOINTS.CONSTRUCTION_SUB_CHECKLIST,
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

export const fetchAllSubChecklist = createAsyncThunk(
  'SubChecklist/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IConstructionSubChecklist[]>>(
        API_ENDPOINTS.CONSTRUCTION_SUB_CHECKLIST,
        {
          params: {
            construction_checklist_id: id,
          },
        }
      );
      return { data: response.data, checklistId: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubChecklist = createAsyncThunk(
  'SubChecklist/update',
  async (
    payload: {
      data: Partial<IConstructionSubChecklist>;
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<IConstructionSubChecklist>>(
        `${API_ENDPOINTS.CONSTRUCTION_SUB_CHECKLIST}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubChecklist = createAsyncThunk(
  'SubChecklist/delete',
  async (payload: { id: string; checklistId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_SUB_CHECKLIST}/${payload.id}`
      );
      return {
        id: payload.id || null,
        checklistId: payload.checklistId || null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//checklist predecessor
export const createChecklistPredecessor = createAsyncThunk(
  'ChecklistPredecessor/create',
  async (payload: IConstructionChecklistPredecessor, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IConstructionChecklistPredecessor>>(
        API_ENDPOINTS.CONSTRUCTION_CHECKLIST_PREDECESSOR,
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

export const fetchAllChecklistPredecessor = createAsyncThunk(
  'ChecklistPredecessor/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IConstructionChecklistPredecessor[]>>(
        API_ENDPOINTS.CONSTRUCTION_CHECKLIST_PREDECESSOR,
        {
          params: {
            construction_checklist_id: id,
          },
        }
      );
      return { data: response.data, checklistId: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChecklistPredecessor = createAsyncThunk(
  'ChecklistPredecessor/update',
  async (
    payload: {
      data: Partial<IConstructionChecklistPredecessor>;
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<IConstructionChecklistPredecessor>>(
        `${API_ENDPOINTS.CONSTRUCTION_CHECKLIST_PREDECESSOR}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChecklistPredecessor = createAsyncThunk(
  'ChecklistPredecessor/delete',
  async (payload: { id: string; checklistId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_CHECKLIST_PREDECESSOR}/${payload.id}`
      );
      return {
        id: payload.id,
        checklistId: payload.checklistId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
