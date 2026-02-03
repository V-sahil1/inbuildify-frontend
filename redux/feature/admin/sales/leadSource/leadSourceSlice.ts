import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createleadSource,
  fetchAllleadSource,
  updateleadSource,
  updateleadSourceStatus,
} from './leadSourceThunk';
import { ILeadSourceState } from './ILeadSourceState';

const initialState: ILeadSourceState = {
  leadSource: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const leadSoucerSlice = createSlice({
  name: 'leadSource',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createleadSource.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createleadSource.fulfilled, (state, action) => {
      state.leadSource.unshift(action.payload);
      state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createleadSource.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllleadSource.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllleadSource.fulfilled, (state, action) => {
      state.leadSource = action.payload.leadSource;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllleadSource.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateleadSource.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateleadSource.fulfilled, (state, action) => {
      state.leadSource = state.leadSource.map(i =>
        i.leadSourceId === action.payload.leadSourceId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateleadSource.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(updateleadSourceStatus.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateleadSourceStatus.fulfilled, (state, action) => {
      state.leadSource = state.leadSource.map(i =>
        i.leadSourceId === action.payload.leadSourceId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateleadSourceStatus.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default leadSoucerSlice.reducer;
