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
import { createAppointment, updateAppointment } from '../appointment/appointmentThunk';
import { createTask, updateTask } from '../task/taskThunk';

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
  reducers: {
    resetActionStatus: state => {
      state.status = Status.IDLE;
      state.actions = { notes: [], tasks: [], appointments: [], sms: [] };
    },
    resetSmsStatus: state => {
      state.smsStatus = Status.IDLE;
      state.sms = [];
    },
    resetTagStatus: state => {
      state.tagStatus = Status.IDLE;
      state.notes = [];
    },
  },
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
      state.actions.sms.unshift(action.payload);
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
      state.actions.sms = state.actions.sms.map(i =>
        i.smsId === action.payload.smsId ? action.payload : i
      );
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
      const data = action.payload.notes;
      const filterdNote = action.payload.notes.filter(i => !i.parentNoteId);
      state.notes = filterdNote?.map(i => ({
        ...i,
        reply: data.find(j => j.parentNoteId === i.notesId)?.description,
        replyId: data.find(j => j.parentNoteId === i.notesId)?.notesId,
      }));
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(getAllNotes.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    builder.addCase(createNote.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(createNote.fulfilled, (state, action) => {
      if (action.payload?.parentNoteId) {
        state.notes = state.notes.map(i =>
          i.notesId === action.payload?.parentNoteId
            ? { ...i, reply: action.payload?.description, replyId: action.payload?.notesId }
            : i
        );
        state.actions.notes = state.actions.notes.map(i =>
          i.notesId === action.payload?.parentNoteId
            ? { ...i, reply: action.payload?.description, replyId: action.payload?.notesId }
            : i
        );
      } else {
        state.notes.unshift(action.payload);
        state.actions.notes.unshift(action.payload);
        if (!!action.payload?.task) {
          const data = action.payload?.task;
          state.actions.tasks.unshift({
            taskId: data?.id,
            name: data?.taskname,
            dueDate: data?.dueDate,
          });
        }
      }
      state.tagStatus = Status.SUCCESS;
    });
    builder.addCase(createNote.rejected, state => {
      state.tagStatus = Status.ERROR;
    });

    builder.addCase(updateNote.pending, state => {
      state.tagStatus = Status.PENDING;
    });
    builder.addCase(updateNote.fulfilled, (state, action) => {
      if (!!action.payload?.parentNoteId) {
        state.notes = state.notes.map(i =>
          i.notesId === action.payload?.parentNoteId
            ? { ...i, reply: action.payload?.description }
            : i
        );
        state.actions.notes = state.actions.notes.map(i =>
          i.notesId === action.payload?.parentNoteId
            ? { ...i, reply: action.payload?.description }
            : i
        );
      } else {
        state.notes = state.notes.map(i =>
          i.notesId === action.payload.notesId ? { ...i, ...action.payload } : i
        );
        state.actions.notes = state.actions.notes.map(i =>
          i.notesId === action.payload.notesId ? { ...i, ...action.payload } : i
        );
      }
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
      const data = action.payload?.notes || [];
      const filtered = data.filter(i => !i.parentNoteId);
      state.actions = {
        ...action.payload,
        notes: filtered.map(i => ({
          ...i,
          reply: data.find(j => j.parentNoteId === i.notesId)?.description,
          replyId: data.find(j => j.parentNoteId === i.notesId)?.notesId,
        })),
      };

      state.status = Status.SUCCESS;
    });
    builder.addCase(getLeadActions.rejected, (state, action) => {
      state.status = Status.ERROR;
    });

    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.actions.appointments.unshift(action.payload);
    });

    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.actions.appointments = state.actions.appointments.map(i =>
        i.appointmentId === action.payload.appointmentId ? action.payload : i
      );
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      state.actions.tasks.unshift(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.actions.tasks = state.actions.tasks.map(i =>
        i.taskId === action.payload.taskId ? action.payload : i
      );
    });
  },
});

export const { resetActionStatus, resetSmsStatus, resetTagStatus } = actionSlice.actions;
export default actionSlice.reducer;
