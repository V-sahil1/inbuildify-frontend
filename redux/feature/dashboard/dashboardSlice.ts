import { createSlice } from '@reduxjs/toolkit';
import { getDashboardThunk } from './dashboardThunk';
import { Status } from '@lib/constants/enum';
import { DashboardData } from './dashboardState';

type initialDashboardState = {
  dashboard: DashboardData;
  status: Status;
};

const initialState: initialDashboardState = {
  dashboard: null,
  status: Status.IDLE,
};
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getDashboardThunk.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(getDashboardThunk.fulfilled, (state, action) => {
      state.dashboard = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getDashboardThunk.rejected, state => {
      state.status = Status.ERROR;
    });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
