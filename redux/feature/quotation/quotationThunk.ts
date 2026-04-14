import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import {
  CustomSection,
  ExtraItem,
  Quotation,
  QuotationComparison,
  QuotationPriceListItem,
  QuotationResponse,
  QuotationVersionDetails,
} from './IQuotationState';


export const getQuotationVersionById = createAsyncThunk(
  'quotation/getVersionById',
  async (
    { quoteId, quoteVersionId }: { quoteId: string; quoteVersionId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<ApiResponse<QuotationVersionDetails[]>>(
        API_ENDPOINTS.QUOTATION_VERSION_DETAILS + '/' + quoteVersionId
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

//quotation version
export const createQuotationVersionThunk = createAsyncThunk(
  'quotation/createQuotationVersion',
  async (versionId: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<QuotationVersionDetails>>(
        API_ENDPOINTS.QUOTATION_NEW_VERSION(versionId)
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
      const res = await api.post<ApiResponse>(
        API_ENDPOINTS.QUOTATION_VERSION_ITEM + API_ENDPOINTS.ITEM_BASE,
        { data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuotationAdditionalPricellistThunk = createAsyncThunk(
  'quotation/createQuotationAdditionalPricellistThunk',
  async (payload: { data: ExtraItem; versionId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(
        API_ENDPOINTS.QUOTATION_EXTRA_ITEM + '/' + payload.versionId,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationPricelistThunk = createAsyncThunk(
  'quotation/getQuotationPricelist',
  async (
    params: {
      quotationVersionId: string;
      package_id?: string;
      range_id?: string;
      dwelling_type_id?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { quotationVersionId, ...rest } = params;
      const res = await api.get<ApiResponse>(
        API_ENDPOINTS.QUOTATION_VERSION_ITEM + '/version/' + quotationVersionId,
        { params: rest }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationItemThunk = createAsyncThunk(
  'quotation/updateQuotationItemThunk',
  async (
    payload: {
      quotationVersionItemId: string;
      quantity?: number;
      note?: string;
      priceListItemDescription?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { quotationVersionItemId, quantity, note, priceListItemDescription } = payload;
      const res = await api.put<ApiResponse>(
        API_ENDPOINTS.QUOTATION_VERSION_ITEM + '/' + quotationVersionItemId,
        {
          data: {
            quantity,
            note: note || undefined,
            priceListItemDescription: priceListItemDescription || undefined,
          },
        }
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
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.QUOTATION_VERSION_ITEM + API_ENDPOINTS.ITEM_BASE + '/' + id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// quotation package
export const createQuotationPackageThunk = createAsyncThunk(
  'quotation/createQuotationPackageThunk',
  async (
    payload: { quotationVersionId: string; packageId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<QuotationVersionDetails>>(
        API_ENDPOINTS.QUOTATION_PACKAGE_CREATE,
        {
          data: {
            quotationVersionId: payload.quotationVersionId,
            packageId: payload.packageId,
          }
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationPackageThunk = createAsyncThunk(
  'quotation/deleteQuotationPackageThunk',
  async (payload: { versionId: string; pkgId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(
        API_ENDPOINTS.QUOTATION_PACKAGE(payload.versionId, payload.pkgId)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//quotation compare

export const createQuotationCompareThunk = createAsyncThunk(
  'quotation/createQuotationCompareThunk',
  async (
    payload: {
      data: { versions: { quotationId: string; versionId: string }[]; showAll: boolean };
      leadId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<QuotationComparison>>(
        API_ENDPOINTS.QUOTATION_COMPARE + '/' + payload.leadId,
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

//quotation custom section

export const createQuotationCustomSection = createAsyncThunk(
  'quotation/createQuotationCustomSection',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<CustomSection>>(
        API_ENDPOINTS.QUOTATION_CUSTOM_SECTION,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationCustomSection = createAsyncThunk(
  'quotation/updateQuotationCustomSection',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<CustomSection>>(
        API_ENDPOINTS.QUOTATION_CUSTOM_SECTION + '/' + payload.id,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationCustomSection = createAsyncThunk(
  'quotation/getQuotationCustomSection',
  async (quotationVersionId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<CustomSection[]>>(
        API_ENDPOINTS.QUOTATION_CUSTOM_SECTION + '/' + quotationVersionId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationCustomSection = createAsyncThunk(
  'quotation/deleteQuotationCustomSection',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.QUOTATION_CUSTOM_SECTION + '/' + id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveQuotation = createAsyncThunk(
  'quotation/approveQuotation',
  async ({versionId, payload}: { versionId: string; payload: { sketchNumber: number; isApprove: boolean } }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(API_ENDPOINTS.QUOTATION_VERSION + '/' + versionId,
        {data:payload}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationPdf = createAsyncThunk(
  'quotation/getQuotationPdf',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse>(API_ENDPOINTS.QUOTATION_VERSION_PDF(id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
