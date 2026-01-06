import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { ISchedularSettingState } from './ischedularSchedularState';
import { fetchSchedularSetting, updateSchedularSetting } from './schedularSettingThunk';

const initialState: ISchedularSettingState = {
  receiverOfReplies: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const schedularSettingSlice = createSlice({
  name: 'schedularSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSchedularSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchSchedularSetting.fulfilled, (state, action) => {
      state.receiverOfReplies = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchSchedularSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateSchedularSetting.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateSchedularSetting.fulfilled, (state, action) => {
      state.receiverOfReplies = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateSchedularSetting.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default schedularSettingSlice.reducer;
