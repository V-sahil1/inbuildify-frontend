import { Status } from '@lib/constants/enum';
import { createSlice } from '@reduxjs/toolkit';
import {
  createNote,
  createSms,
  getActionsThunk,
  getActionTags,
  getAllNotes,
  getAllSms,
  getLeadActions,
  updateNote,
  updateSms,
} from './actionThunk';

export const actionSlice = createSlice({
  name: 'action',
  initialState: {
    actions: { notes: [], tasks: [], appointments: [], sms: [] },
    tags: [],
    sms: [],
    notes: [],
    tagStatus: Status.IDLE,
    smsStatus: Status.IDLE,
    status: Status.IDLE,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getActionsThunk.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(getActionsThunk.fulfilled, (state, action) => {
      state.actions = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getActionsThunk.rejected, state => {
      state.status = Status.ERROR;
    });

    builder.addCase(getActionTags.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(getActionTags.fulfilled, (state, action) => {
      state.tags = action.payload;
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(getActionTags.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    builder.addCase(getAllSms.pending, state => {
      state.smsStatus = Status.PENDING;
    });
    builder.addCase(getAllSms.fulfilled, (state, action) => {
      state.sms = action.payload.sms;
      state.smsStatus = Status.SUCCESS;
    });
    builder.addCase(getAllSms.rejected, state => {
      state.smsStatus = Status.ERROR;
    });

    builder.addCase(createSms.pending, state => {
      state.smsStatus = Status.PENDING;
    });
    builder.addCase(createSms.fulfilled, (state, action) => {
      state.sms.unshift(action.payload);
      state.smsStatus = Status.SUCCESS;
    });
    builder.addCase(createSms.rejected, state => {
      state.smsStatus = Status.ERROR;
    });

    builder.addCase(updateSms.pending, state => {
      state.smsStatus = Status.PENDING;
    });
    builder.addCase(updateSms.fulfilled, (state, action) => {
      state.sms = state.sms.map(i => (i.smsId === action.payload.smsId ? action.payload : i));
      state.smsStatus = Status.SUCCESS;
    });
    builder.addCase(updateSms.rejected, state => {
      state.smsStatus = Status.ERROR;
    });

    //notes
    builder.addCase(getAllNotes.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      state.notes = action.payload.notes;
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(getAllNotes.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    builder.addCase(createNote.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(createNote.fulfilled, (state, action) => {
      state.notes.unshift(action.payload);
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(createNote.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    builder.addCase(updateNote.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(updateNote.fulfilled, (state, action) => {
      state.notes = state.notes.map(i =>
        i.notesId === action.payload.notesId ? action.payload : i
      );
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(updateNote.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    //lead action
    builder.addCase(getLeadActions.pending, (state, action) => {
      state.status = Status.PENDING;
    });
    builder.addCase(getLeadActions.fulfilled, (state, action) => {
      state.actions = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getLeadActions.rejected, (state, action) => {
      state.status = Status.ERROR;
    });
  },
});

export default actionSlice.reducer;
