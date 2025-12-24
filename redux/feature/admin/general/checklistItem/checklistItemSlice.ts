import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createChecklistItem,
  deleteChecklistItem,
  fetchAllChecklistItem,
  updateChecklistItem,
} from './checklistItemThunk';
import { IChecklistItemState } from './IChecklistItemState';

const initialState: IChecklistItemState = {
  checklistItem: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const checklistItemSlice = createSlice({
  name: 'checklistItem',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createChecklistItem.fulfilled, (state, action) => {
      state.checklistItem.unshift(action.payload);
    });
    builder.addCase(fetchAllChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = action.payload.records;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = state.checklistItem.map(i =>
        i.checklistItemId === action.payload.checklistItemId ? action.payload : i
      );
    });
    builder.addCase(deleteChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = state.checklistItem.filter(i => i.checklistItemId !== action.payload);
    });
  },
});
export default checklistItemSlice.reducer;
