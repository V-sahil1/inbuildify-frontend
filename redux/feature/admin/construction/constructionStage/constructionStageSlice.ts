import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IStageState } from './IConstructionStageState';
import {
  createStage,
  deleteStage,
  fetchAllConstructionStage,
  updateStage,
} from './constructionStageThunk';

const initialState: IStageState = {
  stage: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createStage.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createStage.fulfilled, (state, action) => {
      state.stage.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createStage.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllConstructionStage.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllConstructionStage.fulfilled, (state, action) => {
      state.stage = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllConstructionStage.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateStage.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateStage.fulfilled, (state, action) => {
      state.stage = state.stage.map(i =>
        i.constructionStage === action.payload.constructionStage ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateStage.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteStage.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteStage.fulfilled, (state, action) => {
      state.stage = state.stage.filter(i => i.constructionStage !== action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteStage.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default stageSlice.reducer;
