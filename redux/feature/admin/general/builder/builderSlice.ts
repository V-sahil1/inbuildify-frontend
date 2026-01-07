import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { fetchBuilderInfo, updateBuilderDetails } from './builderThunk';
import { BuilderInfo, IBuilderState } from './ibuilderState';

const initialState: IBuilderState = {
  builder: <BuilderInfo>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBuilderInfo.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchBuilderInfo.fulfilled, (state, action) => {
      state.builder = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchBuilderInfo.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateBuilderDetails.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateBuilderDetails.fulfilled, (state, action) => {
      state.builder = { ...state.builder, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateBuilderDetails.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default builderSlice.reducer;
