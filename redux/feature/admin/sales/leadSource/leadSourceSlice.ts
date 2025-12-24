import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum'
import { createleadSource, deleteleadSource, fetchAllleadSource, updateleadSource } from './leadSourceThunk';
import { ILeadSourceState } from './ILeadSourceState';

const initialState: ILeadSourceState = {
  leadSource: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const leadSoucerSlice = createSlice({
  name: 'leadSource',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createleadSource.fulfilled, (state, action) => {
      state.leadSource.unshift(action.payload);
    });
    builder.addCase(fetchAllleadSource.fulfilled, (state, action) => {
      state.leadSource = action.payload.leadSource;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateleadSource.fulfilled, (state, action) => {
      state.leadSource = state.leadSource.map((i => i.leadSourceId === action.payload.leadSourceId ? action.payload : i))
    });
    builder.addCase(deleteleadSource.fulfilled, (state, action) => {
      state.leadSource = state.leadSource.filter((i => i.leadSourceId !== action.payload))
    });
  },
});
export default leadSoucerSlice.reducer;
