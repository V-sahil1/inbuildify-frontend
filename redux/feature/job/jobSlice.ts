import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IJobState, initialJobFilters, JobFilters, JobStatusSummary } from './IJobState';
import { getAllJobsThunk, updateJobStatusThunk } from './jobThunk';
import { Status } from '@lib/constants/enum';

const initialState: IJobState = {
  jobs: [],
  pagination: { page: 1, limit: 25, total: 0, totalPages: 0 },
  totalJobs: 0,
  statusSummary: {
    'In Progress': 0,
    'Completed':   0,
    'On Hold':     0,
    'Cancelled':   0,
    'Archived':    0,
  },
  filters: initialJobFilters,
  status: {
    list:         Status.IDLE,
    updateStatus: Status.IDLE,
  },
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobFilters(state, action: PayloadAction<Partial<JobFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetJobFilters(state) {
      state.filters = initialJobFilters;
    },
    clearJobs(state) {
      state.jobs       = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: builder => {
    // ── getAllJobsThunk ───────────────────────────────────
    builder
      .addCase(getAllJobsThunk.pending, state => {
        state.status.list = Status.PENDING;
      })
      .addCase(getAllJobsThunk.fulfilled, (state, action) => {
        state.status.list = Status.SUCCESS;
        const payload = action.payload as any;
        state.jobs          = payload?.jobs ?? [];
        state.pagination    = payload?.pagination ?? initialState.pagination;
        state.statusSummary = payload?.statusSummary ?? initialState.statusSummary;
        state.totalJobs     = payload?.totalJobs ?? 0;
      })
      .addCase(getAllJobsThunk.rejected, state => {
        state.status.list = Status.ERROR;
      });

    // ── updateJobStatusThunk ─────────────────────────────
    builder
      .addCase(updateJobStatusThunk.pending, state => {
        state.status.updateStatus = Status.PENDING;
      })
      .addCase(updateJobStatusThunk.fulfilled, (state, action) => {
        state.status.updateStatus = Status.SUCCESS;
        const { jobId, status } = action.payload as any;
        const job = state.jobs.find(j => j.jobId === jobId);
        if (job) job.status = status;
      })
      .addCase(updateJobStatusThunk.rejected, state => {
        state.status.updateStatus = Status.ERROR;
      });
  },
});

export const { setJobFilters, resetJobFilters, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
