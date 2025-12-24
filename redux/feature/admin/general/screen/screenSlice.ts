import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IScreenState } from './IScreenState';
import { createScreen, deleteScreen, fetchAllScreen, updateScreen } from './screenThunk';

const initialState: IScreenState = {
  screen: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createScreen.fulfilled, (state, action) => {
      state.screen.unshift(action.payload);
    });
    builder.addCase(fetchAllScreen.fulfilled, (state, action) => {
      state.screen = action.payload.screens;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateScreen.fulfilled, (state, action) => {
      state.screen = state.screen.map((i => i.screenId === action.payload.screenId ? action.payload : i))
    });
    builder.addCase(deleteScreen.fulfilled, (state, action) => {
      state.screen = state.screen.filter((i => i.screenId !== action.payload))
    });
  },
});
export default screenSlice.reducer;
