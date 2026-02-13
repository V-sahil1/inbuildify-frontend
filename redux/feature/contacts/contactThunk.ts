import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { IContact } from './contactState';

export const createContact = createAsyncThunk(
  'contact/create',
  async (payload: IContact, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IContact>>(API_ENDPOINTS.CONTACT, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllContact = createAsyncThunk(
  'contact/fetchAll',
  async (params: { search?: string; is_active?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<IContact[]>>(API_ENDPOINTS.CONTACT, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contact/update',
  async (payload: { data: Partial<IContact>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IContact>>(
        `${API_ENDPOINTS.CONTACT}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contact/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponse<IContact>>(`${API_ENDPOINTS.CONTACT}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
