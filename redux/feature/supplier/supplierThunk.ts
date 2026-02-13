import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { CommonPagination } from '../common/ICommonState';
import { ISupplierType, Supplier } from './ISupplierState';

export const fetchAllSupplierType = createAsyncThunk(
  'supplierType/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ supplierType: ISupplierType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.SUPPLIER_TYPE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllSuppliers = createAsyncThunk(
  'supplier/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Supplier[]>>(API_ENDPOINTS.SUPPLIER);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
