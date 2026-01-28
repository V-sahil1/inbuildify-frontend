import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { CostCennterGetParams, CostCenterChecklist, ICostCenter } from './IcostCenterState';

export const fetchAllCostCenter = createAsyncThunk(
  'costCenter/fetchAll',
  async (params: CostCennterGetParams, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ICostCenter[]>>(API_ENDPOINTS.COST_CENTER, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCostCenter = createAsyncThunk(
  'costCenter/create',
  async (payload: ICostCenter, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ICostCenter>>(API_ENDPOINTS.COST_CENTER, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCostCenter = createAsyncThunk(
  'costCenter/update',
  async (payload: { data: Partial<ICostCenter>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ICostCenter>>(
        `${API_ENDPOINTS.COST_CENTER}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCostCenter = createAsyncThunk(
  'costCenter/deleteQuestion',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.COST_CENTER}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//map checklist
export const fetchAllCostCenterChecklist = createAsyncThunk(
  'costCenter/fetchAllChecklist',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<CostCenterChecklist[]>>(
        API_ENDPOINTS.COST_CENTER_CHECKLIST,
        { params: { cost_center_id: id } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCostCenterChecklist = createAsyncThunk(
  'costCenter/createChecklist',
  async (payload: CostCenterChecklist, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<CostCenterChecklist>>(
        API_ENDPOINTS.COST_CENTER_CHECKLIST,
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

export const deleteCostCenterChecklist = createAsyncThunk(
  'costCenter/deleteChecklist',
  async (
    payload: {
      costCenterId: string;
      constructionChecklistId: string;
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.COST_CENTER_CHECKLIST}/${payload.id}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
