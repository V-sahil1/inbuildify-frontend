import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import {
  CustomSection,
  ExtraItem,
  Quotation,
  QuotationComparison,
  QuotationItemPayload,
  QuotationListResponse,
  QuotationFilterOption,
  QuotationPriceListItem,
  QuotationResponse,
  QuotationStatusCounts,
  QuotationVersionDetails,
} from './IQuotationState';

/** Normalize filter-options API body (array or wrapped { data }) to a list. */
export function unwrapQuotationFilterOptionsResponse(res: unknown): QuotationFilterOption[] {
  if (!res) return [];
  if (Array.isArray(res)) return res as QuotationFilterOption[];
  const r = res as Record<string, unknown>;
  if (Array.isArray(r.data)) return r.data as QuotationFilterOption[];
  const inner = r.data as Record<string, unknown> | undefined;
  if (inner && Array.isArray(inner.data)) return inner.data as QuotationFilterOption[];
  if (inner && Array.isArray(inner.rows)) return inner.rows as QuotationFilterOption[];
  if (inner && Array.isArray(inner.options)) return inner.options as QuotationFilterOption[];
  if (Array.isArray(r.rows)) return r.rows as QuotationFilterOption[];
  if (Array.isArray(r.options)) return r.options as QuotationFilterOption[];
  return [];
}

export const getAllQuotationsThunk = createAsyncThunk(
  'quotation/getAllQuotations',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      statuses?: string[];
      leadIds?: string[];
      contactIds?: string[];
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<ApiResponse<QuotationListResponse>>(
        API_ENDPOINTS.GET_ALL_QUOTATIONS(params)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationStatusCountsThunk = createAsyncThunk(
  'quotation/getStatusCounts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<QuotationStatusCounts>>(
        API_ENDPOINTS.QUOTATION_STATUS_COUNTS
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationFilterOptionsThunk = createAsyncThunk(
  'quotation/getFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<unknown>(API_ENDPOINTS.QUOTATION_FILTER_OPTIONS);
      return unwrapQuotationFilterOptionsResponse(res);
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Failed to load filter options');
    }
  }
);

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
      // Check if data contains File objects that need FormData
      const hasFile = Object.values(payload.data).some(value => value instanceof File);
      
      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.entries(payload.data).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const res = await apiWithFormDataMethods.put<ApiResponse<QuotationVersionDetails>>(
          API_ENDPOINTS.QUOTATION_VERSION + '/' + payload.id,
          formData
        );
        return res.data;
      } else {
        // Use regular JSON for non-file data
        const res = await api.put<ApiResponse<QuotationVersionDetails>>(
          API_ENDPOINTS.QUOTATION_VERSION + '/' + payload.id,
          { data: payload.data }
        );
        return res.data;
      }
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
      const res = await api.put<ApiResponse<QuotationVersionDetails>>(
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


export const sendQuotationEmailThunk = createAsyncThunk(
  'quotation/sendQuotationEmail',
  async ({ versionId }: { versionId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(API_ENDPOINTS.QUOTATION_SEND_EMAIL(versionId), {});
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//send email to Structural Engineer
export const sendEmailToStructuralEngineer = createAsyncThunk(
  'quotation/sendEmailToStructuralEngineer',
  async ({versionId}: { versionId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(API_ENDPOINTS.QUOTATION_VERSION + '/' + versionId + '/send-engineer-email');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);