import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { ICommonState } from './ICommonState';
import { fetchAllFunctionality, fetchTimeZone } from './commonThunk';


const initialState: ICommonState = {
  functionality: [],
  timezone: [],
  status:{
    functionality: Status.IDLE, 
    timezoneStatus: Status.IDLE
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllFunctionality.pending, state => {
      state.status.functionality = Status.PENDING;
    });
    builder.addCase(fetchAllFunctionality.fulfilled, (state, action) => {
      state.functionality = action.payload.functionalities;
      state.status.functionality = Status.SUCCESS;
    });
    builder.addCase(fetchAllFunctionality.rejected, state => {
      state.status.functionality = Status.ERROR;
    });

    builder.addCase(fetchTimeZone.pending, (state) => {
      state.status.timezoneStatus = Status.PENDING;
    });

    builder.addCase(fetchTimeZone.fulfilled, (state, action) => {
      state.timezone = action.payload.timezones;
      state.status.timezoneStatus = Status.SUCCESS;
    });

    builder.addCase(fetchTimeZone.rejected, (state) => {
      state.status.timezoneStatus = Status.ERROR;
    });
  },
});
export default commonSlice.reducer;
