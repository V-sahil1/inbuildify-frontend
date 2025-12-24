import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ISettingState, setting } from './ISettingState';
import { fetchSetting, updateSetting } from './settingThunk';

const initialState: ISettingState = {
  setting: <setting>{},
  status: {
    fetch: Status.IDLE,
  },
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSetting.fulfilled, (state, action) => {
      state.setting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateSetting.fulfilled, (state, action) => {
      state.setting = { ...state.setting, ...action.payload };
    });
  },
});
export default settingSlice.reducer;
