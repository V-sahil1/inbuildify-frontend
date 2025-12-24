import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';

import { createProcess, deleteProcess, fetchAllProcess, updateProcess } from './processThunk';
import { IProcessState } from './IProcessState';

const initialState: IProcessState = {
  process: [],
  status: {
    create: Status.IDLE,
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createProcess.fulfilled, (state, action) => {
      state.process.push(action.payload);
    });
    builder.addCase(fetchAllProcess.fulfilled, (state, action) => {
      state.process = action.payload.sales_process;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateProcess.fulfilled, (state, action) => {
      state.process = state.process.map(i =>
        i.salesProcessId === action.payload.salesProcessId ? action.payload : i
      );
    });
    builder.addCase(deleteProcess.fulfilled, (state, action) => {
      state.process = state.process.filter(i => i.salesProcessId !== action.payload);
    });
  },
});
export default processSlice.reducer;
