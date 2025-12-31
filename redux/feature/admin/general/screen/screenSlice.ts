import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IScreenState } from './IScreenState';
import { fetchAllScreen } from './screenThunk';

const initialState: IScreenState = {
  screen: [],
  status: Status.IDLE,
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllScreen.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(fetchAllScreen.fulfilled, (state, action) => {
      state.screen = action.payload.screens;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchAllScreen.rejected, state => {
      state.status = Status.ERROR;
    });
  },
});
export default screenSlice.reducer;
