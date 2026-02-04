import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { Color, ColorGroup, Category, SubCategoryItem } from './iColourState';

// In colorThunk.ts
export const fetchColourCategory = createAsyncThunk(
  'color/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colors: Color[] }>>(
        API_ENDPOINTS.COLOUR
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
  async (payload: { colorName: string; status: boolean; sortOrder?: number }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Color>>(API_ENDPOINTS.COLOUR, {
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
    { payload, id }: { payload: { colorName: string; status: boolean; sortOrder?: number }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<Color>>(
        API_ENDPOINTS.COLOUR + '/' + id,
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
      const res = await api.delete<ApiResponse<Color>>(
        API_ENDPOINTS.COLOUR + '/' + payload
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
      const res = await api.get<ApiResponse< Category[] >>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload
      );
      return { data: res.data, colorId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourSubCategory = createAsyncThunk(
  'color/createCategory',
  async (
    payload: {
      suppliers: string[];
      selectionType?: string;
      sortOrder?: number;
      status?: string;
      colorId: string;
      categoryName: string;
      colorGroup: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<Category>>(API_ENDPOINTS.COLOUR_CATEGORY_BASE, {
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
    payload: {
      data: {
      suppliers: string[];
      selectionType?: string;
      sortOrder?: number;
      status?: string;
      colorId: string;
      categoryName: string;
      colorGroup: string[];
      }
      colorCategoryId: string },
    { rejectWithValue }
  ) => {
    console.log("Payload", payload.data);
    try {
      const res = await api.put<ApiResponse<Category>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload.colorCategoryId,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourSubCategory = createAsyncThunk(
  'color/deleteSubCategory',
  async (payload: { colorCategoryId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Category>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload.colorCategoryId
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

//colorGroup

export const createColourGroup = createAsyncThunk(
  'color/createGroup',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<ColorGroup>>(
        API_ENDPOINTS.COLOUR_GROUP,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchColourGroups = createAsyncThunk(
  'color/getGroup',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorGroups: ColorGroup[] }>>(
        API_ENDPOINTS.COLOUR_GROUP
      );
      return res.data;
    }
    catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

export const updateColourGroup = createAsyncThunk(
  'color/updateGroup',
  async ({ payload, id }: { payload: FormData; id: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<ColorGroup>>(
        API_ENDPOINTS.COLOUR_GROUP + '/' + id,
        { data: payload }
      )
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)


export const deleteColourGroup = createAsyncThunk(
  'colour/deleteGroup',
  async (payload: string, { rejectWithValue }) => {

    try {
      const res = await api.delete<ApiResponse<ColorGroup>>(
        API_ENDPOINTS.COLOUR_GROUP + '/' + payload
      );
      return { ...res.data, deletedId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)
