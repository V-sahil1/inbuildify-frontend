import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IChecklistState } from './IChecklistState';
import {
  createChecklist,
  deleteChecklist,
  fetchAllChecklist,
  updateChecklist,
} from './checklistThunk';

const initialState: IChecklistState = {
  checklist: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createChecklist.fulfilled, (state, action) => {
      state.checklist.unshift(action.payload);
    });
    builder.addCase(fetchAllChecklist.fulfilled, (state, action) => {
      state.checklist = action.payload.checklist;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.map(i =>
        i.checklistId === action.payload.checklistId ? action.payload : i
      );
    });
    builder.addCase(deleteChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.filter(i => i.checklistId !== action.payload);
    });
  },
});
export default checklistSlice.reducer;
