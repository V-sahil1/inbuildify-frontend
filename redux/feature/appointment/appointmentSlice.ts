import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createAppointment,
  deleteAppointment,
  fetchAllAppointment,
  fetchAppointmentTabCounts,
  updateAppointment,
} from './appointmentThunk';
import { IAppointmentState, IAppointmentTabCounts } from './IAppointmentState';

const initialTabCounts: IAppointmentTabCounts = {
  all: 0,
  today: 0,
  tomorrow: 0,
  thisWeek: 0,
  nextWeek: 0,
  pending: 0,
};

const initialState: IAppointmentState = {
  appointment: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasMore: false,
  },
  tabCounts: initialTabCounts,
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
    loadMore: Status.IDLE,
    tabCounts: Status.IDLE,
  },
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    resetAppointmentFetch(state) {
      state.status.fetch = Status.IDLE;
      state.status.loadMore = Status.IDLE;
      state.appointment = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: builder => {
    // Create
    builder.addCase(createAppointment.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.appointment.unshift(action.payload);
      state.pagination.totalRecords += 1;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createAppointment.rejected, state => {
      state.status.create = Status.ERROR;
    });

    // Fetch (initial load page=1 replaces list; page>1 appends)
    builder.addCase(fetchAllAppointment.pending, (state, action) => {
      const page = action.meta.arg?.page ?? 1;
      if (page > 1) {
        state.status.loadMore = Status.PENDING;
      } else {
        state.status.fetch = Status.PENDING;
      }
    });
    builder.addCase(fetchAllAppointment.fulfilled, (state, action) => {
      const { appointment, totalRecords, totalPages, currentPage } = action.payload;
      const page = action.meta.arg?.page ?? 1;

      if (page > 1) {
        state.appointment = [...state.appointment, ...appointment];
        state.status.loadMore = Status.SUCCESS;
      } else {
        state.appointment = appointment;
        state.status.fetch = Status.SUCCESS;
      }

      state.pagination = {
        currentPage,
        totalPages,
        totalRecords,
        hasMore: currentPage < totalPages,
      };
    });
    builder.addCase(fetchAllAppointment.rejected, (state, action) => {
      const page = action.meta.arg?.page ?? 1;
      if (page > 1) {
        state.status.loadMore = Status.ERROR;
      } else {
        state.status.fetch = Status.ERROR;
      }
    });

    // Update
    builder.addCase(updateAppointment.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.appointment = state.appointment.map(i =>
        i.appointmentId === action.payload.appointmentId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateAppointment.rejected, state => {
      state.status.create = Status.ERROR;
    });

    // Delete
    builder.addCase(deleteAppointment.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.appointment = state.appointment.map(i =>
        i.appointmentId === action.payload.appointmentId ? action.payload : i
      );
      // state.pagination.totalRecords = Math.max(0, state.pagination.totalRecords - 1);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteAppointment.rejected, state => {
      state.status.create = Status.ERROR;
    });

    // Tab counts
    builder.addCase(fetchAppointmentTabCounts.pending, state => {
      state.status.tabCounts = Status.PENDING;
    });
    builder.addCase(fetchAppointmentTabCounts.fulfilled, (state, action) => {
      state.tabCounts = { ...initialTabCounts, ...action.payload };
      state.status.tabCounts = Status.SUCCESS;
    });
    builder.addCase(fetchAppointmentTabCounts.rejected, state => {
      state.status.tabCounts = Status.ERROR;
    });
  },
});

export const { resetAppointmentFetch } = appointmentSlice.actions;
export default appointmentSlice.reducer;
