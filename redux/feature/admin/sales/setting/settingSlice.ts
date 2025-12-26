import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ISettingState, setting } from './ISettingState';
import { fetchSetting, updateSetting } from './settingThunk';

const initialState: ISettingState = {
  setting: <setting>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchSetting.fulfilled, (state, action) => {
      state.setting = action.payload.salesModuleSettings;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateSetting.fulfilled, (state, action) => {
      state.setting = { ...state.setting, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default settingSlice.reducer;
