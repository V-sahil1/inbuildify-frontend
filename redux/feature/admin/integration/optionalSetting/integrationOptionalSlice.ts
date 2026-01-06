import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchIntegrationSetting, updateIntegrationSetting } from './integrationOptionalThunk';
import { IIntegrationSettingState } from './IintegrationOptionalState';

const initialState: IIntegrationSettingState = {
  integrationSetting: null,
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const IntegrationSettingSlice = createSlice({
  name: 'integrationSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchIntegrationSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchIntegrationSetting.fulfilled, (state, action) => {
      state.integrationSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchIntegrationSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateIntegrationSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateIntegrationSetting.fulfilled, (state, action) => {
      state.integrationSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateIntegrationSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default IntegrationSettingSlice.reducer;
