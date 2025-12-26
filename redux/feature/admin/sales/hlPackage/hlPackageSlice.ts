import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchhlPackageSetting, updatehlPackageSetting } from './hlPackageThunk';
import { HLPackageSettings, IhlPackageSettingState } from './IhlPackageState';

const initialState: IhlPackageSettingState = {
  hlPackageSetting: <HLPackageSettings>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const hlPackageSettingSlice = createSlice({
  name: 'hlPackage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchhlPackageSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchhlPackageSetting.fulfilled, (state, action) => {
      state.hlPackageSetting = action.payload.houseLandPackageSettings;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchhlPackageSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updatehlPackageSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updatehlPackageSetting.fulfilled, (state, action) => {
      state.hlPackageSetting = { ...state.hlPackageSetting, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updatehlPackageSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default hlPackageSettingSlice.reducer;
