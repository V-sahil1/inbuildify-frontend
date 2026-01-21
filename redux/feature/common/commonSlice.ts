import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ICommonState } from './ICommonState';
import {
  fetchAllBuiders,
  fetchAllFunctionality,
  fetchLocation,
  fetchComplianceType,
  fetchTimeZone,
} from './commonThunk';

const initialState: ICommonState = {
  functionality: [],
  builders: [],
  timezone: [],
  locations: [],
  complianceType: [],
  status: {
    builder: Status.IDLE,
    functionality: Status.IDLE,
    timezoneStatus: Status.IDLE,
    locationStatus: Status.IDLE,
    complianceTypeStatus: Status.IDLE,
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

    builder.addCase(fetchTimeZone.pending, state => {
      state.status.timezoneStatus = Status.PENDING;
    });

    builder.addCase(fetchTimeZone.fulfilled, (state, action) => {
      state.timezone = action.payload.timezones;
      state.status.timezoneStatus = Status.SUCCESS;
    });

    builder.addCase(fetchTimeZone.rejected, state => {
      state.status.timezoneStatus = Status.ERROR;
    });

    builder.addCase(fetchAllBuiders.pending, state => {
      state.status.builder = Status.PENDING;
    });
    builder.addCase(fetchAllBuiders.fulfilled, (state, action) => {
      state.builders = action.payload;
      state.status.builder = Status.SUCCESS;
    });
    builder.addCase(fetchAllBuiders.rejected, state => {
      state.status.builder = Status.ERROR;
    });
    builder.addCase(fetchLocation.pending, state => {
      state.status.locationStatus = Status.PENDING;
    });
    builder.addCase(fetchLocation.fulfilled, (state, action) => {
      state.locations = action.payload;
      state.status.locationStatus = Status.SUCCESS;
    });
    builder.addCase(fetchLocation.rejected, state => {
      state.status.locationStatus = Status.ERROR;
    });

    builder.addCase(fetchComplianceType.pending, state => {
      state.status.complianceTypeStatus = Status.PENDING;
    });
    builder.addCase(fetchComplianceType.fulfilled, (state, action) => {
      state.complianceType = action.payload;
      state.status.complianceTypeStatus = Status.SUCCESS;
    });
    builder.addCase(fetchComplianceType.rejected, state => {
      state.status.complianceTypeStatus = Status.ERROR;
    });
  },
});
export default commonSlice.reducer;
