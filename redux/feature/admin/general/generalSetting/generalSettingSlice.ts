import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { GeneralSetting, IGeneralSettingState } from './igeneralSettingState';
import { fetchGeneralSetting, updateGeneralSetting } from './generalSettingThunk';
import { stat } from 'fs';

const initialState: IGeneralSettingState = {
  settings: <GeneralSetting>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const generalSettingSlice = createSlice({
  name: 'generalSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchGeneralSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchGeneralSetting.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchGeneralSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateGeneralSetting.pending, (state, action) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateGeneralSetting.fulfilled, (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateGeneralSetting.rejected, (state, action) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default generalSettingSlice.reducer;
