import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum'
import { IStageState } from './IConstructionStageState';
import { createStage, deleteStage, fetchAllStage, updateStage } from './constructionStageThunk';

const initialState: IStageState = {
  stage: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createStage.fulfilled, (state, action) => {
      state.stage.unshift(action.payload);
    });
    builder.addCase(fetchAllStage.fulfilled, (state, action) => {
      state.stage = action.payload.constructionStages;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateStage.fulfilled, (state, action) => {
      state.stage = state.stage.map((i => i.constructionStage === action.payload.constructionStage ? action.payload : i))
    });
    builder.addCase(deleteStage.fulfilled, (state, action) => {
      state.stage = state.stage.filter((i => i.constructionStage !== action.payload))
    });
  },
});
export default stageSlice.reducer;
