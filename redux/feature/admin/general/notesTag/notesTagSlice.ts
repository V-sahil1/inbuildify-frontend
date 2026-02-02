import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { INotesTagState } from './INotesTagState';
import { createNotesTag, deleteNotesTag, fetchAllNotesTag, updateNotesTag } from './notesTagThunk';

const initialState: INotesTagState = {
  notesTag: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const noteTagsSlice = createSlice({
  name: 'noteTags',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createNotesTag.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createNotesTag.fulfilled, (state, action) => {
      state.notesTag.unshift(action.payload);
      state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createNotesTag.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllNotesTag.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllNotesTag.fulfilled, (state, action) => {
      state.notesTag = action.payload.noteTag;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllNotesTag.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateNotesTag.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateNotesTag.fulfilled, (state, action) => {
      state.notesTag = state.notesTag.map(i =>
        i.notesTagId === action.payload.notesTagId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateNotesTag.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteNotesTag.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteNotesTag.fulfilled, (state, action) => {
      state.notesTag = state.notesTag.filter(i => i.notesTagId !== action.payload);
      state.pagination.totalRecords--;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteNotesTag.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default noteTagsSlice.reducer;
