import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchCustomerPortalInfo, updateCustomerPortalDetails } from './customerPortalThunk';
import { CustomerPortalInfo, ICustomerState } from './icustomerPortalState';

const initialState: ICustomerState = {
  customer: <CustomerPortalInfo>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const customerPortalSlice = createSlice({
  name: 'customerPortal',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCustomerPortalInfo.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchCustomerPortalInfo.fulfilled, (state, action) => {
      state.customer = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchCustomerPortalInfo.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateCustomerPortalDetails.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateCustomerPortalDetails.fulfilled, (state, action) => {
      state.customer = { ...state.customer, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateCustomerPortalDetails.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default customerPortalSlice.reducer;
