import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { fetchAllCostCenter } from './costCenterThunk';
import { ICostCenterState } from './IcostCenterState';

const initialState: ICostCenterState = {
  costCenter: [],
  status: {
    fetch: Status.IDLE,
  },
};

const costCenterSlice = createSlice({
  name: 'costCenter',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllCostCenter.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCostCenter.fulfilled, (state, action) => {
      state.costCenter = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllCostCenter.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
  },
});
export default costCenterSlice.reducer;
