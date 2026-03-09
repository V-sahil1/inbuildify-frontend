import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import api from '@lib/constants/api';
import {
  Quotation,
  QuotationItemPayload,
  QuotationPriceListItem,
  QuotationResponse,
  QuotationVersionDetails,
} from './IQuotationState';

export const createQuotation = createAsyncThunk(
  'quotation/create',
  async (
    payload: { quoteId?: string; quotationPayload: QuotationItemPayload },
    { rejectWithValue }
  ) => {
    try {
      const { quoteId, quotationPayload } = payload;
      const apiEndpoint = quoteId
        ? API_ENDPOINTS.QUOTATION_BASE + '/' + quoteId + '/version'
        : API_ENDPOINTS.QUOTATION_BASE;
      const res = await api.post<ApiResponse<QuotationResponse>>(apiEndpoint, {
        data: quotationPayload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationById = createAsyncThunk(
  'quotation/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationResponse>>(
        API_ENDPOINTS.QUOTATION_BASE + '/' + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationVersionById = createAsyncThunk(
  'quotation/getVersionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationVersionDetails[]>>(
        API_ENDPOINTS.QUOTATION_VERSION + '/' + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationVersion = createAsyncThunk(
  'quotation/updateVersion',
  async (payload: { id: string; data: Partial<QuotationVersionDetails> }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<QuotationVersionDetails>>(
        API_ENDPOINTS.QUOTATION_VERSION + '/' + payload.id,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  'lead/deleteQuotation',
  async (quotationId: string, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponse>(`${API_ENDPOINTS.QUOTATION_BASE}/${quotationId}`);
      return quotationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//new
export const createQuotationThunk = createAsyncThunk(
  'quotation/createQuotation',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Quotation>>(
        API_ENDPOINTS.QUOTATION_BASE + '/' + leadsId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationThunk = createAsyncThunk(
  'quotation/getQuotation',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Quotation[]>>(
        API_ENDPOINTS.QUOTATION_BASE + '/' + leadsId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationThunk = createAsyncThunk(
  'quotation/deleteQuotation',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<QuotationResponse>>(
        API_ENDPOINTS.QUOTATION_BASE + '/' + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// quotation pricelist

export const createQuotationPricellistThunk = createAsyncThunk(
  'quotation/createQuotationPricelist',
  async (data: QuotationPriceListItem, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<QuotationPriceListItem>>(
        API_ENDPOINTS.QUOTATION_PRICELIST,
        { data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationPricelistThunk = createAsyncThunk(
  'quotation/getQuotationPricelist',
  async (quotationVersionId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationPriceListItem[]>>(
        API_ENDPOINTS.QUOTATION_PRICELIST + '/' + quotationVersionId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationPricelistThunk = createAsyncThunk(
  'quotation/deleteQuotationPricelist',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.QUOTATION_PRICELIST + '/' + id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
