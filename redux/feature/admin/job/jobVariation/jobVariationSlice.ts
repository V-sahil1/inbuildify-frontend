import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import {
  fetchJobVariationSetting,
  fetchJobVariationLimit,
  updateJobVariationSetting,
  createJobVariationLimit,
  updateJobVariationLimit,
  deleteJobVariationLimit,
} from './jobVariationThunk';
import { IJobVariationState } from './IJobVariationState';

const initialState: IJobVariationState = {
  jobVariationSetting: null,
  jobVariationLimit: [],
  VariationLimitStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobVariationSlice = createSlice({
  name: 'jobVariation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobVariationSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobVariationSetting.fulfilled, (state, action) => {
      state.jobVariationSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobVariationSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobVariationSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobVariationSetting.fulfilled, (state, action) => {
      state.jobVariationSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobVariationSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });

    //variation approval
    builder.addCase(fetchJobVariationLimit.pending, state => {
      state.VariationLimitStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobVariationLimit.fulfilled, (state, action) => {
      state.jobVariationLimit = action.payload;
      state.VariationLimitStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobVariationLimit.rejected, state => {
      state.VariationLimitStatus.fetch = Status.ERROR;
    });

    builder.addCase(createJobVariationLimit.pending, state => {
      state.VariationLimitStatus.update = Status.PENDING;
    });
    builder.addCase(createJobVariationLimit.fulfilled, (state, action) => {
      state.jobVariationLimit.push(action.payload);
      state.VariationLimitStatus.update = Status.SUCCESS;
    });
    builder.addCase(createJobVariationLimit.rejected, state => {
      state.VariationLimitStatus.update = Status.ERROR;
    });

    builder.addCase(updateJobVariationLimit.pending, state => {
      state.VariationLimitStatus.update = Status.PENDING;
    });
    builder.addCase(updateJobVariationLimit.fulfilled, (state, action) => {
      const index = state.jobVariationLimit.findIndex(
        item => item.jobVariationApprovalId === action.payload.jobVariationApprovalId
      );
      if (index !== -1) {
        state.jobVariationLimit[index] = action.payload;
      }
      state.VariationLimitStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateJobVariationLimit.rejected, state => {
      state.VariationLimitStatus.update = Status.ERROR;
    });

    builder.addCase(deleteJobVariationLimit.pending, state => {
      state.VariationLimitStatus.update = Status.PENDING;
    });
    builder.addCase(deleteJobVariationLimit.fulfilled, (state, action) => {
      const index = state.jobVariationLimit.findIndex(
        item => item.jobVariationApprovalId === action.payload.jobVariationApprovalId
      );
      if (index !== -1) {
        state.jobVariationLimit.splice(index, 1);
      }
      state.VariationLimitStatus.update = Status.SUCCESS;
    });
    builder.addCase(deleteJobVariationLimit.rejected, state => {
      state.VariationLimitStatus.update = Status.ERROR;
    });
  },
});
export default JobVariationSlice.reducer;
