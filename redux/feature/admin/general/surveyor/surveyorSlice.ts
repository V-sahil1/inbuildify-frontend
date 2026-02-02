import { createSlice } from '@reduxjs/toolkit';
import { createSurveyor, deleteServeyor, fetchAllServeyor, updateServeyor } from './surveyorThunk';
import { Status } from '@lib/constants/enum';
import { ISurveyorState } from './ISurveyorState';

const initialState: ISurveyorState = {
  surveyor: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const surveyorSlice = createSlice({
  name: 'surveyor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createSurveyor.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createSurveyor.fulfilled, (state, action) => {
      state.surveyor.unshift(action.payload);
      state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createSurveyor.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllServeyor.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllServeyor.fulfilled, (state, action) => {
      state.surveyor = action.payload.surveyors;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllServeyor.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateServeyor.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateServeyor.fulfilled, (state, action) => {
      state.surveyor = state.surveyor.map(i =>
        i.surveyorId === action.payload.surveyorId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateServeyor.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteServeyor.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteServeyor.fulfilled, (state, action) => {
      state.surveyor = state.surveyor.filter(i => i.surveyorId !== action.payload);
      state.pagination.totalRecords--;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteServeyor.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default surveyorSlice.reducer;
