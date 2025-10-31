import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ColorCategory, SubCategory, SubCategoryItem } from './iColourState';

// In colorThunk.ts
export const fetchColourCategory = createAsyncThunk(
  'color/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorCategories: ColorCategory[] }>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE
      );
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch color categories';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createColourCategory = createAsyncThunk(
  'color/create',
  async (payload: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<ColorCategory>>(API_ENDPOINTS.COLOUR_CATEGORY_BASE, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourCategory = createAsyncThunk(
  'color/update',
  async (
    { payload, id }: { payload: { name: string; description: string }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<ColorCategory>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + id,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourCategory = createAsyncThunk(
  'color/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<ColorCategory>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateColourCategoryOrder = createAsyncThunk(
//   "workflowProcess/updateOrder",
//   async (
//     payload: {
//       workflowProcesses: { workflowProcessId: string; displayOrder: number }[];
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await api.put<ApiResponse<WorkflowProcess>>(
//         API_ENDPOINTS.WORKFLOW_PROCESS_ORDER,
//         { data: { orderedWorkflowProcess: payload.workflowProcesses } }
//       );
//       return { data: res.data, workflowProcesses: payload.workflowProcesses };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchColourSubCategory = createAsyncThunk(
  'color/fetchSubCategory',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorSubCategories: SubCategory[] }>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_BASE + '/' + payload
      );
      return { data: res.data, colorCategoryId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourSubCategory = createAsyncThunk(
  'color/createSubCategory',
  async (
    payload: { name: string; description: string; colorCategoryId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<SubCategory>>(API_ENDPOINTS.COLOUR_SUB_CATEGORY_BASE, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourSubCategory = createAsyncThunk(
  'color/updateSubCategory',
  async (
    payload: { name: string; description: string; colorSubCategoryId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<SubCategory>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_BASE + '/' + payload.colorSubCategoryId,
        { data: { name: payload.name, description: payload.description } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourSubCategory = createAsyncThunk(
  'color/deleteSubCategory',
  async (payload: { colorSubCategoryId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<SubCategory>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_BASE + '/' + payload.colorSubCategoryId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Fetch items of a category
export const fetchColourSubCategoryItems = createAsyncThunk(
  'color/fetchSubCategoryItems',
  async (payload: { colorSubCategoryId: string; colorCategoryId: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorItems: SubCategoryItem[] }>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM + '/' + payload.colorSubCategoryId
      );
      return {
        data: res.data,
        colorCategoryId: payload.colorCategoryId,
        colorSubCategoryId: payload.colorSubCategoryId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourSubCategoryItem = createAsyncThunk(
  'workflowProcess/createItem',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<SubCategoryItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourSubCategoryItem = createAsyncThunk(
  'workflowProcess/updateItem',
  async (payload: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<SubCategoryItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM + '/' + payload.id,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourSubCategoryItem = createAsyncThunk(
  'workflowProcess/deleteItem',
  async (payload: { workflowProcessTaskId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<SubCategoryItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM + '/' + payload.workflowProcessTaskId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
