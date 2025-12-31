import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchJobWorkflow, updateJobWorkflow } from './jobWorkflowThunk';
import { IJobWorkflowState } from './IJobWorkflowState';

const initialState: IJobWorkflowState = {
  jobWorkflow: null,
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobWorkflowSlice = createSlice({
  name: 'jobWorkflow',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobWorkflow.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobWorkflow.fulfilled, (state, action) => {
      state.jobWorkflow = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobWorkflow.rejected, (state, action) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobWorkflow.pending, (state, action) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobWorkflow.fulfilled, (state, action) => {
      state.jobWorkflow = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobWorkflow.rejected, (state, action) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default JobWorkflowSlice.reducer;
