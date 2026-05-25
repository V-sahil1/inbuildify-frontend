import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../auth/IAuthState";
import api, { apiWithFormDataMethods } from "@lib/constants/api";

export const getallQuotationFormatThunk = createAsyncThunk(
  'quotationFormat/getall',
  async () => {
    try {
      const res = await api.get<ApiResponse>(API_ENDPOINTS.QUOTATION_FORMAT);
      return res.data;

    } catch (error) {
      return error.message;
    }
  }
);

export const getQuotationFormatByIdThunk = createAsyncThunk(
  'quotationFormat/getById',
  async (id: string) => {
    try {
      const res = await api.get<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT}/${id}`);
      return res.data;

    } catch (error) {
      return error.message;
    }
  }
);

type PaginationParams = {
  page?: number;
  limit?: number;
};

type GetMasterSectionsParams = PaginationParams & {
  masterSectionId?: string;
};

export const DEFAULT_PAGE_LIMIT = 10;

export const getQuotationFormatMasterSectionsThunk = createAsyncThunk(
  'quotationFormat/getMasterSections',
  async (
    { masterSectionId, page = 1, limit = DEFAULT_PAGE_LIMIT }: GetMasterSectionsParams = {},
    { rejectWithValue }
  ) => {
    try {
      const url = masterSectionId
        ? `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION}/${masterSectionId}`
        : API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION;

      const res = await api.get<ApiResponse>(url, {
        params: masterSectionId ? undefined : { page, limit },
      });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationFormatMasterSectionsHeadersThunk = createAsyncThunk(
  'quotationFormat/getMasterSectionHeaders',
  async (
    { masterSectionId, page = 1, limit = DEFAULT_PAGE_LIMIT }: GetMasterSectionsParams = {},
    { rejectWithValue }
  ) => {
    try {
      const url = masterSectionId
        ? `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_HEADER}/${masterSectionId}`
        : API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_HEADER;

      const res = await api.get<ApiResponse>(url, { params: { page, limit } });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuotationFormatMasterSectionsItemsThunk = createAsyncThunk(
  'quotationFormat/getMasterSectionItems',
  async (
    { masterSectionId, page = 1, limit = DEFAULT_PAGE_LIMIT }: GetMasterSectionsParams = {},
    { rejectWithValue }
  ) => {
    try {
      const url = masterSectionId
        ? `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_ITEM}/${masterSectionId}`
        : API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_ITEM;

      const res = await api.get<ApiResponse>(url, { params: { page, limit } });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const createQuotationFormatMasterSectionThunk = createAsyncThunk(
  'quotationFormat/createMasterSection',
  async ({ quotationFormatId, payload }: { quotationFormatId: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION}/${quotationFormatId}`, {data: payload});
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuotationFormatMasterSectionHeaderThunk = createAsyncThunk(
  'quotationFormat/createMasterSectionHeader',
  async ({ masterSectionId, payload }: { masterSectionId: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(
        `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_HEADER}/${masterSectionId}`,
        {data: payload}
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuotationFormatMasterSectionItemThunk = createAsyncThunk(
  'quotationFormat/createMasterSectionItem',
  async ({ masterSectionHeaderId, payload }: { masterSectionHeaderId: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(
        `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_ITEM}/${masterSectionHeaderId}`,
        { data: payload }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuotationFormatThunk = createAsyncThunk(
  'quotationFormat/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse>(API_ENDPOINTS.QUOTATION_FORMAT,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationFormatThunk = createAsyncThunk(
  'quotationFormat/update',
  async ({ id, payload }: { id: string; payload: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT}/${id}`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// custom-section
export const getCustomSectionByIdThunk = createAsyncThunk(
  'quotationFormat/getCustomSectionById',
  async (id: string) => {
    try {
      const res = await api.get<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_CUSTOM_SECTION}/${id}`);
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);


export const createCustomSectionThunk = createAsyncThunk(
  'quotationFormat/createCustomSection',
  async ({ id, payload }: { id: string; payload: FormData }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_CUSTOM_SECTION}/${id}`,
        { data: payload }
      );
      return res.data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomSectionThunk = createAsyncThunk(
  'quotationFormat/updateCustomSection',
  async ({ id, payload }: { id: string; payload: FormData }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_CUSTOM_SECTION}/${id}`, { data: payload });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationFormatMasterSectionThunk = createAsyncThunk(
  'quotationFormat/deleteMasterSection',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION}/${id}`);
      return { id, data: res.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationFormatMasterSectionHeaderThunk = createAsyncThunk(
  'quotationFormat/deleteMasterSectionHeader',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_HEADER}/${id}`);
      return { id, data: res.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuotationFormatMasterSectionItemThunk = createAsyncThunk(
  'quotationFormat/deleteMasterSectionItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_ITEM}/${id}`);
      return { id, data: res.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationFormatMasterSectionItemThunk = createAsyncThunk(
  'quotationFormat/updateMasterSectionItem',
  async ({ itemId, payload }: { itemId: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(
        `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_ITEM}/${itemId}`,
        { data: payload }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationFormatMasterSectionThunk = createAsyncThunk(
  'quotationFormat/updateMasterSection',
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(
        `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION}/${id}`,
        { data: payload }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuotationFormatMasterSectionHeaderThunk = createAsyncThunk(
  'quotationFormat/updateMasterSectionHeader',
  async ({ headerId, payload }: { headerId: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse>(
        `${API_ENDPOINTS.QUOTATION_FORMAT_MASTER_SECTION_HEADER}/${headerId}`,
        { data: payload }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
