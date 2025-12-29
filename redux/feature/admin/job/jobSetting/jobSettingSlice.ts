import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchJobSetting } from './jobSettingThunk';
import { IJobSettingState } from './IJobSettingState';

const initialState: IJobSettingState = {
  jobSetting: null,
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobSettingSlice = createSlice({
  name: 'jobSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobSetting.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobSetting.fulfilled, (state, action) => {
      state.jobSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobSetting.rejected, (state, action) => {
      state.status.fetch = Status.ERROR;
    });
  },
});
export default JobSettingSlice.reducer;
