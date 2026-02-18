import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import {
  ColorGroup,
  Category,
  ColorType,
  ColorItem,
  IColorType,
  ColorItemCopy,
  ColorItemCustomField,
} from './iColourState';

// In colorThunk.ts
export const fetchAllColour = createAsyncThunk('color/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ApiResponse<{ colors: ColorType[] }>>(API_ENDPOINTS.COLOUR);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createColour = createAsyncThunk(
  'color/create',
  async (
    payload: { colorName: string; status: boolean; sortOrder?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<ColorType>>(API_ENDPOINTS.COLOUR, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColour = createAsyncThunk(
  'color/update',
  async (
    {
      payload,
      id,
    }: { payload: { colorName: string; status: boolean; sortOrder?: number }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<ColorType>>(API_ENDPOINTS.COLOUR + '/' + id, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColour = createAsyncThunk(
  'color/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.COLOUR + '/' + payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const copyColour = createAsyncThunk(
  'color/copy',
  async (
    payload: { data: { colorName: string; sortOrder?: number }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<ColorType>>(API_ENDPOINTS.COLOR_COPY(payload.id), {
        data: payload.data,
      });
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

export const fetchColourCategory = createAsyncThunk(
  'color/fetchSubCategory',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Category[]>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload
      );
      return { data: res.data, colorId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourCategory = createAsyncThunk(
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

export const updateColourCategory = createAsyncThunk(
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
      };
      colorCategoryId: string;
    },
    { rejectWithValue }
  ) => {
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

export const deleteColourCategory = createAsyncThunk(
  'color/deleteSubCategory',
  async (payload: { colorCategoryId: string; colorId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Category>>(
        API_ENDPOINTS.COLOUR_CATEGORY_BASE + '/' + payload.colorCategoryId
      );
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const copyColorCategory = createAsyncThunk(
  'color/copyColorCategory',
  async (
    payload: {
      data: { colorId: string; categoryName?: string; sortOrder?: number };
      id: string;
      colorId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<Category>>(
        API_ENDPOINTS.COLOUR_CATEGORY_COPY(payload.id),
        {
          data: payload.data,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch items of a category
export const fetchColourItems = createAsyncThunk(
  'color/fetchSubCategoryItems',
  async (payload: { colorCategoryId: string; colorId: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorItems: ColorItem[] }>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM,
        { params: { color_category_id: payload.colorCategoryId } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourItem = createAsyncThunk(
  'workflowProcess/createItem',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<ColorItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourItem = createAsyncThunk(
  'workflowProcess/updateItem',
  async (payload: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<ColorItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM + '/' + payload.id,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourItem = createAsyncThunk(
  'workflowProcess/deleteItem',
  async (payload: { id: string; colorCategoryId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM + '/' + payload.id
      );
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const copyColourItem = createAsyncThunk(
  'workflowProcess/copyColourItem',
  async (payload: { data: ColorItemCopy; id: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<ColorItem>>(
        API_ENDPOINTS.COLOUR_SUB_CATEGORY_ITEM_COPY(payload.id),
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveColourItem = createAsyncThunk(
  'workflowProcess/moveColourItem',
  async (
    payload: {
      data: { colorCategoryId: string; colorId: string };
      id: string;
      colorCategoryId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<ColorItem>>(
        API_ENDPOINTS.COLOR_ITEM_MOVE(payload.id),
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//color item customField
export const fetchColourItemCustomField = createAsyncThunk(
  'color/fetchColourItemCustomField',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ colorItemCustomFields: ColorItemCustomField[] }>>(
        API_ENDPOINTS.COLOR_ITEM_CUSTOM_FIELD,
        { params: { color_item: id } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourItemCustomField = createAsyncThunk(
  'color/createColourItemCustomField',
  async (data: ColorItemCustomField, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<ColorItemCustomField>>(
        API_ENDPOINTS.COLOR_ITEM_CUSTOM_FIELD,
        {
          data,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourItemCustomField = createAsyncThunk(
  'color/updateColourItemCustomField',
  async (payload: { id: string; data: ColorItemCustomField }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<ColorItemCustomField>>(
        API_ENDPOINTS.COLOR_ITEM_CUSTOM_FIELD + '/' + payload.id,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourItemCustomField = createAsyncThunk(
  'color/deleteColourItemCustomField',
  async (payload: { id: string; colorItemId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(
        API_ENDPOINTS.COLOR_ITEM_CUSTOM_FIELD + '/' + payload.id
      );
      return;
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
      const res = await api.post<ApiResponse<ColorGroup>>(API_ENDPOINTS.COLOUR_GROUP, {
        data: payload,
      });
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
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateColourGroup = createAsyncThunk(
  'color/updateGroup',
  async ({ payload, id }: { payload: FormData; id: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<ColorGroup>>(API_ENDPOINTS.COLOUR_GROUP + '/' + id, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
);

//color type
export const fetchColourType = createAsyncThunk(
  'color/fetchColourType',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<IColorType[]>>(API_ENDPOINTS.COLOUR_TYPE);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createColourType = createAsyncThunk(
  'color/createColourType',
  async (data: IColorType, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IColorType>>(API_ENDPOINTS.COLOUR_TYPE, { data });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColourType = createAsyncThunk(
  'color/updateColourType',
  async (payload: { id: string; data: IColorType }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<IColorType>>(
        API_ENDPOINTS.COLOUR_TYPE + '/' + payload.id,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColourType = createAsyncThunk(
  'color/deleteColourType',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.COLOUR_TYPE + '/' + id);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
