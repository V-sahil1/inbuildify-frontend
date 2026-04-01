import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
import { NoteDetails, SmsDetails } from 'data/types';
import { ITask } from '../task/ITaskStates';
import { IAppointment } from '../appointment/IAppointmentState';

export const getActionsThunk = createAsyncThunk(
  'action/getActions',
  async (payload: { leadId: string; type?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<any>>(
        `${API_ENDPOINTS.ACTION_BASE}/${payload.leadId}`,
        {
          params: {
            filter: payload.type,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createActionsThunk = createAsyncThunk(
  'action/createActions',
  async (payload: { leadId: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<any>>(
        `${API_ENDPOINTS.ACTION_BASE}/${payload.leadId}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateActionsThunk = createAsyncThunk(
  'action/updateActions',
  async (payload: { actionId: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<any>>(
        `${API_ENDPOINTS.ACTION_BASE}/${payload.actionId}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteActionsThunk = createAsyncThunk(
  'action/deleteActions',
  async (payload: { actionId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.WORKFLOW_PROCESS_TASK_FOR_JOB}/${payload.actionId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getActionTags = createAsyncThunk(
  'action/getActionTags',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<any>>(API_ENDPOINTS.TAGS_BASE);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//lead action note

export const getAllNotes = createAsyncThunk(
  'action/getAllNotes',
  async (params: { leads_id?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse>(API_ENDPOINTS.LEAD_NOTES, {
        params,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  'action/createNote',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse>(API_ENDPOINTS.LEAD_NOTES, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  'action/updateNote',
  async (payload: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse>(
        `${API_ENDPOINTS.LEAD_NOTES}/${payload.id}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'action/deleteNote',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.LEAD_NOTES}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//lead action note

export const getAllSms = createAsyncThunk(
  'action/getAllSms',
  async (params: { leads_id?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse>(API_ENDPOINTS.LEAD_SMS, {
        params,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSms = createAsyncThunk(
  'action/createSms',
  async (
    payload: { leadsId?: string; recipientId?: string; message?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse>(API_ENDPOINTS.LEAD_SMS, { data: payload });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSms = createAsyncThunk(
  'action/updateSms',
  async (
    payload: { id: string; data: { leadsId?: string; recipientId?: string; message?: string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse>(`${API_ENDPOINTS.LEAD_SMS}/${payload.id}`, {
        data: payload.data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSms = createAsyncThunk(
  'action/deleteSms',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.LEAD_SMS}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//lead action

export const getLeadActions = createAsyncThunk(
  'lead/getActions',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<{
        notes: NoteDetails[];
        tasks: ITask[];
        appointments: IAppointment[];
        sms: SmsDetails[];
      }> = await api.get(API_ENDPOINTS.LEAD_ACTION(leadsId));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
