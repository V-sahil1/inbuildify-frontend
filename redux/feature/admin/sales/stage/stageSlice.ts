import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { createStage, deleteStage, fetchAllStage, updateStage } from './stageThunk';
import { IStageState } from './IStageState';

const initialState: IStageState = {
  stage: [],
  status: {
    create: Status.IDLE,
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const stageSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createStage.fulfilled, (state, action) => {
      state.stage.push(action.payload);
    });
    builder.addCase(fetchAllStage.fulfilled, (state, action) => {
      state.stage = action.payload.sales_process;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateStage.fulfilled, (state, action) => {
      state.stage = state.stage.map(i =>
        i.salesProcessId === action.payload.salesProcessId ? action.payload : i
      );
    });
    builder.addCase(deleteStage.fulfilled, (state, action) => {
      state.stage = state.stage.filter(i => i.salesProcessId !== action.payload);
    });
  },
});
export default stageSlice.reducer;
