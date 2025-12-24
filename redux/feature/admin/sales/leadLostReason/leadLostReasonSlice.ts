import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { createLeadLostReason, deleteLeadLostReason, fetchAllLeadLostReason, updateLeadLostReason, updateLeadLostReasonStatus } from './leadLostReasonThunk';
import { IleadLostReasonState } from './ILeadLostReasonState';

const initialState: IleadLostReasonState = {
  leadLostReason: [],
  status: {
    fetch: Status.IDLE,
  },
};

const leadLostReasonSlice = createSlice({
  name: 'leadLostReason',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason.unshift(action.payload);
    });
     builder.addCase(fetchAllLeadLostReason.pending, (state) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason = action.payload.leadLostReason;
      state.status.fetch = Status.SUCCESS;
    });
     builder.addCase(fetchAllLeadLostReason.rejected, (state) => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason = state.leadLostReason.map((i => i.leadLostReasonId === action.payload.leadLostReasonId ? action.payload : i))
    });
    builder.addCase(updateLeadLostReasonStatus.fulfilled,(state,action)=>{
      state.leadLostReason = state.leadLostReason.map((i => i.leadLostReasonId === action.payload.leadLostReasonId ? action.payload : i))
    })
    builder.addCase(deleteLeadLostReason.fulfilled, (state, action) => {
      state.leadLostReason = state.leadLostReason.filter((i => i.leadLostReasonId !== action.payload))
    });
  },
});
export default leadLostReasonSlice.reducer;
