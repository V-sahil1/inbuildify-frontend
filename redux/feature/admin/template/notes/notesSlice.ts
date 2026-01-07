import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  activateNotesTemplate,
  createNotesTemplate,
  fetchNotesTemplate,
  updateNotesTemplate,
} from './notesThunk';
import { INotesState } from './InotesState';

const initialState: INotesState = {
  notes: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
    update: Status.IDLE,
    activate: Status.IDLE,
  },
};

const NotesTemplateSlice = createSlice({
  name: 'notesTemplate',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchNotesTemplate.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchNotesTemplate.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchNotesTemplate.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    // Create
    builder.addCase(createNotesTemplate.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createNotesTemplate.fulfilled, (state, action) => {
      state.notes.push(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createNotesTemplate.rejected, state => {
      state.status.create = Status.ERROR;
    });

    // Update
    builder.addCase(updateNotesTemplate.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateNotesTemplate.fulfilled, (state, action) => {
      const index = state.notes.findIndex(
        note => note.templateNoteId === action.payload.templateNoteId
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateNotesTemplate.rejected, state => {
      state.status.update = Status.ERROR;
    });

    // Activate
    builder.addCase(activateNotesTemplate.pending, state => {
      state.status.activate = Status.PENDING;
    });
    builder.addCase(activateNotesTemplate.fulfilled, (state, action) => {
      const index = state.notes.findIndex(
        note => note.templateNoteId === action.payload.templateNoteId
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      state.status.activate = Status.SUCCESS;
    });
    builder.addCase(activateNotesTemplate.rejected, state => {
      state.status.activate = Status.ERROR;
    });
  },
});

export default NotesTemplateSlice.reducer;
