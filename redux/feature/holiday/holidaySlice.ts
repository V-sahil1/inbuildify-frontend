import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IHolidayState, IRecalculateDateSettings } from './IHolidayState';
import {
  createHoliday,
  deleteHoliday,
  fetchAllHoliday,
  fetchHolidayRealculateDate,
  updateHoliday,
  updateHolidayRealculateDate,
} from './holidayThunk';

const initialState: IHolidayState = {
  recalculateDate: <IRecalculateDateSettings>{},
  holiday: [],
  status: {
    recalculateDate: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    holiday: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
  pagination: null,
};

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {},
  extraReducers: builder => {
    //recalculate date
    builder.addCase(fetchHolidayRealculateDate.pending, state => {
      state.status.recalculateDate.fetch = Status.PENDING;
    });
    builder.addCase(fetchHolidayRealculateDate.fulfilled, (state, action) => {
      state.recalculateDate = action.payload;
      state.status.recalculateDate.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchHolidayRealculateDate.rejected, state => {
      state.status.recalculateDate.fetch = Status.ERROR;
    });
    builder.addCase(updateHolidayRealculateDate.pending, state => {
      state.status.recalculateDate.create = Status.PENDING;
    });

    builder.addCase(updateHolidayRealculateDate.fulfilled, (state, action) => {
      state.recalculateDate = action.payload;
      state.status.recalculateDate.create = Status.SUCCESS;
    });
    builder.addCase(updateHolidayRealculateDate.rejected, state => {
      state.status.recalculateDate.create = Status.ERROR;
    });

    //holiday
    builder.addCase(createHoliday.pending, state => {
      state.status.holiday.create = Status.PENDING;
    });
    builder.addCase(createHoliday.fulfilled, (state, action) => {
      state.holiday.unshift(action.payload);
      state.status.holiday.create = Status.SUCCESS;
    });
    builder.addCase(createHoliday.rejected, state => {
      state.status.holiday.create = Status.ERROR;
    });
    builder.addCase(fetchAllHoliday.pending, state => {
      state.status.holiday.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllHoliday.fulfilled, (state, action) => {
      state.holiday = action.payload.holidays;
      state.pagination = action.payload.pagination;
      state.status.holiday.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllHoliday.rejected, state => {
      state.status.holiday.fetch = Status.ERROR;
    });
    builder.addCase(updateHoliday.pending, state => {
      state.status.holiday.create = Status.PENDING;
    });

    builder.addCase(updateHoliday.fulfilled, (state, action) => {
      state.holiday = state.holiday.map(i =>
        i.holidayId === action.payload.holidayId ? action.payload : i
      );
      state.status.holiday.create = Status.SUCCESS;
    });
    builder.addCase(updateHoliday.rejected, state => {
      state.status.holiday.create = Status.ERROR;
    });

    builder.addCase(deleteHoliday.pending, state => {
      state.status.holiday.create = Status.PENDING;
    });

    builder.addCase(deleteHoliday.fulfilled, (state, action) => {
      state.holiday = state.holiday.filter(i => i.holidayId !== action.payload.id);
      state.status.holiday.create = Status.SUCCESS;
    });
    builder.addCase(deleteHoliday.rejected, state => {
      state.status.holiday.create = Status.ERROR;
    });
  },
});
export default holidaySlice.reducer;
