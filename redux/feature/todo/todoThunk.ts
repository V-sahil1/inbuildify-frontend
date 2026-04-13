import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { ITodo, ITodoCounters, TodoQueryParams } from './IToDoState';
import { CommonPagination } from '../common/ICommonState';

export const fetchAllTodos = createAsyncThunk(
  'todo/fetchAll',
  async (params: TodoQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ todos: ITodo[]; pagination: CommonPagination; counters: ITodoCounters }>
      >(API_ENDPOINTS.TODO_BASE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todo/create',
  async (payload: Partial<ITodo> & Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ITodo>>(API_ENDPOINTS.TODO_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todo/update',
  async (
    payload: { id: string; data: Partial<ITodo> & Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<ITodo>>(`${API_ENDPOINTS.TODO_BASE}/${payload.id}`, {
        data: payload.data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_ENDPOINTS.TODO_BASE}/${id}`);
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
