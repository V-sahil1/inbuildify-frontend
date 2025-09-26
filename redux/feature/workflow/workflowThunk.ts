import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiWithFormDataMethods } from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { RequestTask, Task, WorkflowProcess } from "./iWorkflowState";

export const fetchWorkflowProcess = createAsyncThunk(
  "workflowProcess/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<
        ApiResponse<{ workflowProcesses: WorkflowProcess[] }>
      >(API_ENDPOINTS.WORKFLOW_PROCESS_BASE);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWorkflowProcess = createAsyncThunk(
  "workflowProcess/create",
  async (
    payload: { name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<WorkflowProcess>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_BASE,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkflowProcess = createAsyncThunk(
  "workflowProcess/update",
  async (
    {
      payload,
      id,
    }: { payload: { name: string; description: string }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<WorkflowProcess>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_BASE + "/" + id,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkflowProcess = createAsyncThunk(
  "workflowProcess/delete",
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<WorkflowProcess>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_BASE + "/" + payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkflowProcessOrder = createAsyncThunk(
  "workflowProcess/updateOrder",
  async (
    payload: {
      workflowProcesses: { workflowProcessId: string; displayOrder: number }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<WorkflowProcess>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_ORDER,
        { data: { orderedWorkflowProcess: payload.workflowProcesses } }
      );
      return { data: res.data, workflowProcesses: payload.workflowProcesses };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch items of a category
export const fetchWorkflowProcessTasks = createAsyncThunk(
  "workflowProcess/fetchItems",
  async (
    args: {
      workflowProcessId: string;
      filters?: { range?: string; dwelling_type?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const { workflowProcessId, filters } = args;
      let url = `${API_ENDPOINTS.WORKFLOW_PROCESS_TASK}/${workflowProcessId}`;
      if (filters && (filters.range || filters.dwelling_type)) {
        const query = new URLSearchParams();
        if (filters.range) query.append("range", filters.range);
        if (filters.dwelling_type)
          query.append("dwellingType", filters.dwelling_type);
        url = `${url}?${query.toString()}`;
      }
      const res = await api.get<ApiResponse<Task[]>>(url);
      return { workflowProcessId, items: res.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWorkflowProcessTask = createAsyncThunk(
  "workflowProcess/createItem",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<Task>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_TASK,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkflowProcessTask = createAsyncThunk(
  "workflowProcess/updateItem",
  async (payload: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<Task>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_TASK + "/" + payload.id,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkflowProcessTask = createAsyncThunk(
  "workflowProcess/deleteItem",
  async (payload: { workflowProcessTaskId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Task>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_TASK +
          "/" +
          payload.workflowProcessTaskId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkflowProcessTasksForJob = createAsyncThunk(
  "workflowProcess/fetchItems",
  async (
    payload: { leadId: string; workflowProcessId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<ApiResponse<Task[]>>(
        API_ENDPOINTS.WORKFLOW_PROCESS_TASK_FOR_JOB,
        {
          params: {
            lead_id: payload.leadId,
            workflow_process_id: payload.workflowProcessId,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
