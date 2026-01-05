import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { fetchConstructionSetting, updateConstructionSetting } from './constructionSettingThunk';
import { ConstructionSetting, IConstructionSettingState } from './iconstructionSettingState';

const initialState: IConstructionSettingState = {
  constructionSetting: <ConstructionSetting>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const constructionSettingSlice = createSlice({
  name: 'generalSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchConstructionSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchConstructionSetting.fulfilled, (state, action) => {
      state.constructionSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchConstructionSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateConstructionSetting.pending, (state, action) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateConstructionSetting.fulfilled, (state, action) => {
      state.constructionSetting = { ...state.constructionSetting, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateConstructionSetting.rejected, (state, action) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default constructionSettingSlice.reducer;
