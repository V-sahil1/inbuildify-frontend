import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { IonstructionOptionState } from './ICostructionOptionState';
import {
  createConstructionOption,
  deleteConstructionOption,
  fetchAllConstructionOption,
  updateContructionOption,
} from './constructionOptionThunk';

const initialState: IonstructionOptionState = {
  constructionOption: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const constructionOptionSlice = createSlice({
  name: 'constructionOption',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createConstructionOption.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createConstructionOption.fulfilled, (state, action) => {
      state.constructionOption.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createConstructionOption.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllConstructionOption.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllConstructionOption.fulfilled, (state, action) => {
      state.constructionOption = action.payload.constructionOptions;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllConstructionOption.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateContructionOption.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateContructionOption.fulfilled, (state, action) => {
      state.constructionOption = state.constructionOption.map(i =>
        i.constructionOptionId === action.payload.constructionOptionId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateContructionOption.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteConstructionOption.pending, (state, action) => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteConstructionOption.fulfilled, (state, action) => {
      state.constructionOption = state.constructionOption.filter(
        i => i.constructionOptionId !== action.payload
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteConstructionOption.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default constructionOptionSlice.reducer;
