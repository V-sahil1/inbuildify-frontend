import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createAppointment,
  deleteAppointment,
  fetchAllAppointment,
  updateAppointment,
} from './appointmentThunk';
import { IAppointmentState } from './IAppointmentState';

const initialState: IAppointmentState = {
  appointment: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createAppointment.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.appointment.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createAppointment.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllAppointment.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllAppointment.fulfilled, (state, action) => {
      state.appointment = action.payload.appointment;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllAppointment.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
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
    builder.addCase(deleteAppointment.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.appointment = state.appointment.filter(i => i.appointmentId !== action.meta.arg);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteAppointment.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});

export default appointmentSlice.reducer;
