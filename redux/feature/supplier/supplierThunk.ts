import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import {
  ISupplierType,
  Supplier,
  SupplierChecklist,
  SupplierContact,
  SupplierFetchParams,
  SupplierMapping,
} from './ISupplierState';

// supplier type
export const fetchAllSupplierType = createAsyncThunk(
  'supplierType/fetchAll',
  async (params: { name?: string; is_active?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ISupplierType[]>>(API_ENDPOINTS.SUPPLIER_TYPE, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplierType = createAsyncThunk(
  'supplierType/create',
  async (payload: ISupplierType, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<ISupplierType>>(API_ENDPOINTS.SUPPLIER_TYPE, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplierType = createAsyncThunk(
  'supplierType/update',
  async (
    payload: { data: Partial<ISupplierType>; supplierTypeId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<ISupplierType>>(
        `${API_ENDPOINTS.SUPPLIER_TYPE}/${payload.supplierTypeId}`,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplierType = createAsyncThunk(
  'supplierType/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.SUPPLIER_TYPE}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// supplier
export const fetchAllSuppliers = createAsyncThunk(
  'supplier/fetchAll',
  async (params: SupplierFetchParams, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Supplier[]>>(API_ENDPOINTS.SUPPLIER, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'supplier/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<
        ApiResponse<{ supplier: Supplier; contacts: SupplierContact[] }>
      >(API_ENDPOINTS.SUPPLIER, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/update',
  async (payload: { data: Partial<Supplier>; supplierId: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<Supplier>>(
        `${API_ENDPOINTS.SUPPLIER}/${payload.supplierId}`,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'supplier/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.SUPPLIER}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//supplier contact
export const fetchAllSupplierContacts = createAsyncThunk(
  'supplierContact  /fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<SupplierContact[]>>(
        API_ENDPOINTS.SUPPLIER_CONTACT,
        { params: { supplier_id: id } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplierContact = createAsyncThunk(
  'supplierContact/create',
  async (payload: SupplierContact, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<SupplierContact>>(API_ENDPOINTS.SUPPLIER_CONTACT, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplierContact = createAsyncThunk(
  'supplierContact/update',
  async (
    payload: { data: Partial<SupplierContact>; supplierContactId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<SupplierContact>>(
        `${API_ENDPOINTS.SUPPLIER_CONTACT}/${payload.supplierContactId}`,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplierContact = createAsyncThunk(
  'supplierContact/delete',
  async (payload: { id: string; supplierId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.SUPPLIER_CONTACT}/${payload.id}`);
      return { id: payload.id, supplierId: payload.supplierId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//supplier checklist
export const fetchAllSupplierChecklist = createAsyncThunk(
  'supplierChecklist  /fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<SupplierChecklist[]>>(
        API_ENDPOINTS.SUPPLIER_CHECKLIST,
        { params: { supplier_type_id: id } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplierChecklist = createAsyncThunk(
  'supplierChecklist/create',
  async (payload: SupplierChecklist, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<SupplierChecklist>>(API_ENDPOINTS.SUPPLIER_CHECKLIST, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplierChecklist = createAsyncThunk(
  'supplierChecklist/delete',
  async (payload: { id: string; supplierTypeId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.SUPPLIER_CHECKLIST}/${payload.id}`
      );
      return { id: payload.id, supplierTypeId: payload.supplierTypeId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//supplier supplierType mapping
export const fetchAllSupplierTypeMapping = createAsyncThunk(
  'supplierTypeMapping  /fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<SupplierMapping[]>>(
        API_ENDPOINTS.SUPPLIER_MAPPING,
        { params: { supplier_type_id: id } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplierTypeMapping = createAsyncThunk(
  'supplierTypeMapping/create',
  async (payload: SupplierMapping, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<SupplierMapping>>(API_ENDPOINTS.SUPPLIER_MAPPING, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplierTypeMapping = createAsyncThunk(
  'supplierTypeMapping/update',
  async (
    payload: { id: string; assignToNewAndExistingChecklist: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<SupplierMapping>>(
        `${API_ENDPOINTS.SUPPLIER_MAPPING}/${payload.id}`,
        {
          data: { assignToNewAndExistingChecklist: payload.assignToNewAndExistingChecklist },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplierTypeMapping = createAsyncThunk(
  'supplierTypeMapping/delete',
  async (payload: { id: string; supplierTypeId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.SUPPLIER_MAPPING}/${payload.id}`);
      return { id: payload.id, supplierTypeId: payload.supplierTypeId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
