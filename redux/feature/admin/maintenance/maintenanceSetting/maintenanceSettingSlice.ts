import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IMaintenanceSettingState } from './IMaintenanceSettingState';
import { fetchMaintenanceSetting, updateMaintenanceSetting } from './maintenanceSettingThunk';


const initialState: IMaintenanceSettingState = {
  maintenanceSetting: null,
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const maintenanceSettingSlice = createSlice({
  name: 'maintenanceSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMaintenanceSetting.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchMaintenanceSetting.fulfilled, (state, action) => {
      state.maintenanceSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateMaintenanceSetting.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateMaintenanceSetting.fulfilled, (state, action) => {
      state.maintenanceSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateMaintenanceSetting.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default maintenanceSettingSlice.reducer;
