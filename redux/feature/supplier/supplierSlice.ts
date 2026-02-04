import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { fetchAllSuppliers, fetchAllSupplierType } from './supplierThunk';
import { ISupplierState } from './ISupplierState';

const initialState: ISupplierState = {
  supplierType: [],
  suppliers: [],
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

    builder.addCase(fetchAllSuppliers.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSuppliers.fulfilled, (state, action) => {
      state.suppliers = action.payload.suppliers;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSuppliers.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
  },
});
export default supplierSlice.reducer;
