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
      state.scheduleEmail = action.payload;
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
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateScheduleEmailActive.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default scheduleEmailSlice.reducer;
