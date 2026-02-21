import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { EstateDocument, EstateFeature, EstateImage, EstateStage, IEstate } from './IEstateState';
import { CommonPagination } from '../common/ICommonState';

export const createEState = createAsyncThunk(
  'estate/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<IEstate>>(
        API_ENDPOINTS.ESTATE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEState = createAsyncThunk(
  'estate/fetchAll',
  async (
    params: { name?: string; zip?: string; location?: string; status?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<
        ApiResponse<{ estate: IEstate[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.ESTATE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEState = createAsyncThunk(
  'estate/update',
  async (payload: { data: Partial<IEstate>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IEstate>>(
        `${API_ENDPOINTS.ESTATE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEState = createAsyncThunk(
  'estate/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponse>(`${API_ENDPOINTS.ESTATE}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//estate document

export const createEStateDocument = createAsyncThunk(
  'estateDocument/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<EstateDocument>>(
        API_ENDPOINTS.ESTATE_DOCUMENT,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEStateDocument = createAsyncThunk(
  'estateDocument/fetchAll',
  async (params: { estate_id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ data: EstateDocument[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.ESTATE_DOCUMENT, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//estate feature

export const createEStateFeature = createAsyncThunk(
  'estateFeature/create',
  async (payload: EstateFeature, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<EstateFeature>>(API_ENDPOINTS.ESTATE_FEATURE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEStateFeature = createAsyncThunk(
  'estateFeature/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EstateFeature[]>>(
        API_ENDPOINTS.ESTATE_FEATURE + '/' + id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEStateFeature = createAsyncThunk(
  'estateFeature/update',
  async (payload: { data: Partial<EstateFeature>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<EstateFeature>>(
        `${API_ENDPOINTS.ESTATE_FEATURE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//estate stage

export const createEStateStage = createAsyncThunk(
  'estateStage/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<EstateStage>>(
        API_ENDPOINTS.ESTATE_STAGE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEStateStage = createAsyncThunk(
  'estateStage/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ estateStage: EstateStage[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.ESTATE_STAGE, { params: { estate_id: id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEStateStage = createAsyncThunk(
  'estateStage/update',
  async (payload: { data: Partial<EstateStage>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<EstateStage>>(
        `${API_ENDPOINTS.ESTATE_STAGE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//estate images

export const fetchAllEStateImages = createAsyncThunk(
  'estateImage/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EstateImage>>(API_ENDPOINTS.ESTATE_IMAGE, {
        params: { estate_id: id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEStateImages = createAsyncThunk(
  'estateImage/update',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<EstateImage>>(
        `${API_ENDPOINTS.ESTATE_IMAGE}/${payload.id}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
