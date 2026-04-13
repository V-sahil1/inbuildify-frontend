import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
import { JobFilters } from './IJobState';

/**
 * Fetch paginated / filtered / sorted job list.
 * All filtering, sorting and pagination is handled server-side.
 */
export const getAllJobsThunk = createAsyncThunk(
  'job/getAllJobs',
  async (filters: Partial<JobFilters>, { rejectWithValue }) => {
    try {
      const params: Record<string, string | number | undefined> = {
        page:             filters.page,
        limit:            filters.limit,
        search:           filters.search || undefined,
        status:           filters.status || undefined,
        reference_id:     filters.referenceId || undefined,
        customer_name:    filters.customerName || undefined,
        job_address:      filters.jobAddress || undefined,
        estate_name:      filters.estateName || undefined,
        consultant:       filters.consultant || undefined,
        assignee_id:      filters.assigneeId || undefined,
        created_at_from:  filters.createdAtFrom || undefined,
        created_at_to:    filters.createdAtTo || undefined,
        title_date_from:  filters.titleDateFrom || undefined,
        title_date_to:    filters.titleDateTo || undefined,
        sort_by:          filters.sortBy || 'created_at',
        sort_order:       filters.sortOrder || 'desc',
      };

      // Remove undefined values
      Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);

      const url = API_ENDPOINTS.GET_ALL_JOBS(params as any);
      const response: ApiResponse<any> = await api.get(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch jobs');
    }
  }
);

/**
 * Fetch full detail of a single job by ID.
 */
export const getJobByIdThunk = createAsyncThunk(
  'job/getJobById',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.get(API_ENDPOINTS.GET_JOB_BY_ID(jobId));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch job detail');
    }
  }
);

/**
 * Update the status of a single job.
 */
export const updateJobStatusThunk = createAsyncThunk(
  'job/updateJobStatus',
  async ({ jobId, status }: { jobId: string; status: string }, { rejectWithValue }) => {
    try {
      // api.patch wraps the body under { data: ... } — backend receives { status } in req.body
      const response: ApiResponse<any> = await api.patch(
        API_ENDPOINTS.UPDATE_JOB_STATUS(jobId),
        { data: { status } },
      );
      return { jobId, status, ...(response.data as object) };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update job status');
    }
  }
);
