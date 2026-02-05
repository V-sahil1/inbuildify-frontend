import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IScheduleEmailState } from './ischeduleEmailState';
import {
  fetchAllScheduleEmail,
  updateScheduleEmail,
  updateScheduleEmailActive,
} from './scheduleEmailThunk';

const initialState: IScheduleEmailState = {
  scheduleEmail: [],
  counts: { total: 0, active: 0, inactive: 0 },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const scheduleEmailSlice = createSlice({
  name: 'scheduleEmail',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllScheduleEmail.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllScheduleEmail.fulfilled, (state, action) => {
      state.scheduleEmail = action.payload.scheduler_emails;
      state.counts = action.payload.counts;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllScheduleEmail.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateScheduleEmail.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateScheduleEmail.fulfilled, (state, action) => {
      const index = state.scheduleEmail.findIndex(
        i => i.schedulerEmailId === action.payload.schedulerEmailId
      );
      if (index !== -1) {
        state.scheduleEmail[index] = action.payload;
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateScheduleEmail.rejected, state => {
      state.status.update = Status.ERROR;
    });
    builder.addCase(updateScheduleEmailActive.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateScheduleEmailActive.fulfilled, (state, action) => {
      const index = state.scheduleEmail.findIndex(
        i => i.schedulerEmailId === action.payload.schedulerEmailId
      );
      if (index !== -1) {
        state.scheduleEmail[index] = action.payload;
        if (action.payload.isActive) {
          state.counts.active++;
          state.counts.inactive--;
        } else {
          state.counts.active--;
          state.counts.inactive++;
        }
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateScheduleEmailActive.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default scheduleEmailSlice.reducer;
