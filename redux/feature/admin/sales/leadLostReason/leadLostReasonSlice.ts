import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createLeadLostReason,
  fetchAllLeadLostReason,
  updateLeadLostReason,
  updateLeadLostReasonStatus,
} from './leadLostReasonThunk';
import { IleadLostReasonState } from './ILeadLostReasonState';

const initialState: IleadLostReasonState = {
  leadLostReason: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination:null
};

const leadLostReasonSlice = createSlice({
  name: 'leadLostReason',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createLeadLostReason.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason.unshift(action.payload);
      state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createLeadLostReason.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllLeadLostReason.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason = action.payload.leadLostReason;
      state.pagination=action.payload.pagination
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllLeadLostReason.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateLeadLostReason.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason = state.leadLostReason.map(i =>
        i.leadLostReasonId === action.payload.leadLostReasonId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateLeadLostReason.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(updateLeadLostReasonStatus.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateLeadLostReasonStatus.fulfilled, (state, action) => {
      state.leadLostReason = state.leadLostReason.map(i =>
        i.leadLostReasonId === action.payload.leadLostReasonId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateLeadLostReasonStatus.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default leadLostReasonSlice.reducer;
