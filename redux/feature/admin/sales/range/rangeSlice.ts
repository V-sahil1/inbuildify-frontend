import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { createRange, fetchRange, updateRange, updateRangeStatus } from './rangeThunk';
import { IRangeState } from './IRangeState';

const initialState: IRangeState = {
  range: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const rangeSlice = createSlice({
  name: 'range',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createRange.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createRange.fulfilled, (state, action) => {
      state.range.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createRange.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchRange.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchRange.fulfilled, (state, action) => {
      state.range = action.payload.ranges;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchRange.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateRange.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(updateRange.fulfilled, (state, action) => {
      state.range = state.range.map(i =>
        i.rangeId === action.payload.rangeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateRange.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateRangeStatus.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateRangeStatus.fulfilled, (state, action) => {
      state.range = state.range.map(i =>
        i.rangeId === action.payload.rangeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateRangeStatus.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default rangeSlice.reducer;
