import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { fetchAllSupplierType } from './supplierThunk';
import { ISupplierState } from './ISupplierState';

const initialState: ISupplierState = {
  supplierType: [],
  status: {
    fetch: Status.IDLE,
  },
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllSupplierType.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSupplierType.fulfilled, (state, action) => {
      state.supplierType = action.payload.supplierType;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSupplierType.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
  },
});
export default supplierSlice.reducer;
