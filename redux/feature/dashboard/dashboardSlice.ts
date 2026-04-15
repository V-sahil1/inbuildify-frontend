import { createSlice } from '@reduxjs/toolkit';
import { getDashboardThunk, getSalesDashboardThunk } from './dashboardThunk';
import { Status } from '@lib/constants/enum';
import { DashboardData, SalesDashboardStats } from './dashboardState';

type initialDashboardState = {
  dashboard: DashboardData;
  salesDashboard: SalesDashboardStats | null;
  status: Status;
  salesDashboardStatus: Status;
};

const initialState: initialDashboardState = {
  dashboard: null,
  salesDashboard: null,
  status: Status.IDLE,
  salesDashboardStatus: Status.IDLE,
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

    builder.addCase(getSalesDashboardThunk.pending, state => {
      state.salesDashboardStatus = Status.PENDING;
    });
    builder.addCase(getSalesDashboardThunk.fulfilled, (state, action) => {
      state.salesDashboard = action.payload;
      state.salesDashboardStatus = Status.SUCCESS;
    });
    builder.addCase(getSalesDashboardThunk.rejected, state => {
      state.salesDashboardStatus = Status.ERROR;
    });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
