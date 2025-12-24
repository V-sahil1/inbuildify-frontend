import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { IFunctionaltyState } from './IFunctionalityState';
import {
  createFunctionality,
  deleteFunctionality,
  fetchAllFunctionality,
  updateFunctionality,
} from './functionalityThunk';

const initialState: IFunctionaltyState = {
  functionality: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const functionalitySlice = createSlice({
  name: 'functionality',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createFunctionality.fulfilled, (state, action) => {
      state.functionality.unshift(action.payload);
    });
    builder.addCase(fetchAllFunctionality.fulfilled, (state, action) => {
      state.functionality = action.payload.functionalities;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateFunctionality.fulfilled, (state, action) => {
      state.functionality = state.functionality.map(i =>
        i.functionalityId === action.payload.functionalityId ? action.payload : i
      );
    });
    builder.addCase(deleteFunctionality.fulfilled, (state, action) => {
      state.functionality = state.functionality.filter(i => i.functionalityId !== action.payload);
    });
  },
});
export default functionalitySlice.reducer;
