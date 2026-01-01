import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { CompanyInfo, ICompanyState } from './icompanyState';
import { fetchCompanyInfo, updateCompanyDetails } from './companyThunk';

const initialState: ICompanyState = {
  company: <CompanyInfo>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCompanyInfo.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchCompanyInfo.fulfilled, (state, action) => {
      state.company = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchCompanyInfo.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateCompanyDetails.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateCompanyDetails.fulfilled, (state, action) => {
      state.company = { ...state.company, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateCompanyDetails.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default companySlice.reducer;
