import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  JobPredecessorTask,
  JobProcessFunctionality,
  JobProcessStage,
  JobProcessSubStage,
  JobProcessSubTask,
  JobProcessTask,
} from './IJobProcessState';

export const fetchJobProcessFunctionality = createAsyncThunk(
  'jobProcessFunctionality/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobProcessFunctionality[]>>(
        API_ENDPOINTS.JOB_PROCESS_FUNTIONALITY
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobPredecessorTask = createAsyncThunk(
  'predecessorTask/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobPredecessorTask[]>>(
        API_ENDPOINTS.JOB_TASK_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// job process stage
export const fetchJobProcessStages = createAsyncThunk(
  'jobProcessStage/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobProcessStage[]>>(
        API_ENDPOINTS.JOB_PROCESS_STAGE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJobProcessStages = createAsyncThunk(
  'jobProcessStage/create',
  async (payload: Partial<JobProcessStage>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobProcessStage>>(
        API_ENDPOINTS.JOB_PROCESS_STAGE,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobProcessStages = createAsyncThunk(
  'jobProcessStage/update',
  async (payload: { data: Partial<JobProcessStage>; jobStageId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobProcessStage>>(
        `${API_ENDPOINTS.JOB_PROCESS_STAGE}/${payload.jobStageId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobProcessStage = createAsyncThunk(
  'jobProcessStage/delete',
  async (jobStageId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobProcessStage>>(
        `${API_ENDPOINTS.JOB_PROCESS_STAGE}/${jobStageId}`
      );
      return jobStageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// job process sub stage
export const fetchJobProcessSubStages = createAsyncThunk(
  'jobProcessSubStage/fetch',
  async (stageId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobProcessSubStage[]>>(
        API_ENDPOINTS.JOB_PROCESS_SUB_STAGE(stageId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJobProcessSubStages = createAsyncThunk(
  'jobProcessSubStage/create',
  async (payload: { stageId: string; data: Partial<JobProcessSubStage> }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobProcessSubStage>>(
        API_ENDPOINTS.JOB_PROCESS_SUB_STAGE(payload.stageId),
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobProcessSubStages = createAsyncThunk(
  'jobProcessSubStage/update',
  async (
    payload: { subStageId: string; data: Partial<JobProcessSubStage> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<JobProcessSubStage>>(
        `${API_ENDPOINTS.JOB_PROCESS_SUB_STAGE_BASE}/${payload.subStageId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobProcessSubStages = createAsyncThunk(
  'jobProcessSubStage/delete',
  async (payload: { subStageId: string; taskId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobProcessSubStage>>(
        `${API_ENDPOINTS.JOB_PROCESS_SUB_STAGE_BASE}/${payload.subStageId}`,
        { data: { taskId: payload.taskId } }
      );
      return payload.subStageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// job process task
export const fetchAllJobProcessSubStageTasks = createAsyncThunk(
  'jobProcessSubStageTask/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobProcessTask[]>>(API_ENDPOINTS.JOB_TASK_ONLY);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobProcessSubStageTasks = createAsyncThunk(
  'jobProcessSubStageTask/fetch',
  async (subStageId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<JobProcessTask[]>>(
        API_ENDPOINTS.JOB_PROCESS_TASK(subStageId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJobProcessTasks = createAsyncThunk(
  'jobProcessSubStageTask/create',
  async (payload: { stageId: string; data: Partial<JobProcessTask> }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobProcessTask>>(
        API_ENDPOINTS.JOB_PROCESS_TASK(payload.stageId),
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobProcessTasks = createAsyncThunk(
  'jobProcessSubStageTask/update',
  async (payload: { taskId: string; data: Partial<JobProcessTask> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobProcessTask>>(
        `${API_ENDPOINTS.JOB_TASK_BASE}/${payload.taskId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobProcessTasks = createAsyncThunk(
  'jobProcessSubStageTask/delete',
  async (subStageId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobProcessTask>>(
        `${API_ENDPOINTS.JOB_TASK_BASE}/${subStageId}`
      );
      return subStageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// job process sub task
export const createJobProcessSubTasks = createAsyncThunk(
  'jobProcessSubTask/create',
  async (payload: { taskId: string; data: Partial<JobProcessSubTask> }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<JobProcessSubTask>>(
        API_ENDPOINTS.JOB_PROCESS_SUB_TASK(payload.taskId),
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message ?? 'Create failed');
    }
  }
);

export const updateJobProcessSubTasks = createAsyncThunk(
  'jobProcessSubTask/update',
  async (payload: { subTaskId: string; data: Partial<JobProcessSubTask> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<JobProcessSubTask>>(
        `${API_ENDPOINTS.JOB_SUB_TASK_BASE}/${payload.subTaskId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobProcessSubTasks = createAsyncThunk(
  'jobProcessSubTask/delete',
  async (payload: { subTaskId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<JobProcessSubTask>>(
        `${API_ENDPOINTS.JOB_SUB_TASK_BASE}/${payload.subTaskId}`
      );
      return { subTaskId: payload.subTaskId, taskId: payload.taskId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
