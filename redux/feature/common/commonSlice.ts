import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { ICommonState } from './ICommonState';
import { fetchAllFunctionality } from './commonThunk';


const initialState: ICommonState = {
  functionality: [],
  status:{
    functionality: Status.IDLE, 
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllFunctionality.pending, state => {
      state.status.functionality = Status.PENDING;
    });
    builder.addCase(fetchAllFunctionality.fulfilled, (state, action) => {
      state.functionality = action.payload.functionalities;
      state.status.functionality = Status.SUCCESS;
    });
    builder.addCase(fetchAllFunctionality.rejected, state => {
      state.status.functionality = Status.ERROR;
    });
  },
});
export default commonSlice.reducer;
