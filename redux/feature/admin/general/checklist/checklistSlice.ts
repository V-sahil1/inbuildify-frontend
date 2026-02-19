import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IChecklistState } from './IChecklistState';
import {
  createChecklist,
  createChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  fetchAllChecklist,
  fetchAllChecklistItem,
  updateChecklist,
  updateChecklistItem,
} from './checklistThunk';

const initialState: IChecklistState = {
  checklist: [],
  checklistItem: [],
  checklistItemStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createChecklist.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createChecklist.fulfilled, (state, action) => {
      state.checklist.unshift(action.payload);
      state.pagination.totalRecords++;

      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createChecklist.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllChecklist.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllChecklist.fulfilled, (state, action) => {
      state.checklist = action.payload.checklist;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllChecklist.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateChecklist.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.map(i =>
        i.checklistId === action.payload.checklistId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateChecklist.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(deleteChecklist.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.filter(i => i.checklistId !== action.payload);
      state.status.create = Status.SUCCESS;
      state.pagination.totalRecords--;
    });
    builder.addCase(deleteChecklist.rejected, state => {
      state.status.create = Status.ERROR;
    });

    // checkllist item

    builder.addCase(createChecklistItem.pending, state => {
      state.checklistItemStatus.create = Status.PENDING;
    });
    builder.addCase(createChecklistItem.fulfilled, (state, action) => {
      state.checklistItem.unshift(action.payload);
      state.checklistItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(createChecklistItem.rejected, state => {
      state.checklistItemStatus.create = Status.ERROR;
    });

    builder.addCase(fetchAllChecklistItem.pending, state => {
      state.checklistItemStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = action.payload;
      state.checklistItemStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllChecklistItem.rejected, state => {
      state.checklistItemStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateChecklistItem.pending, state => {
      state.checklistItemStatus.create = Status.PENDING;
    });
    builder.addCase(updateChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = state.checklistItem.map(i =>
        i.checklistItemId === action.payload.checklistItemId ? action.payload : i
      );
      state.checklistItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateChecklistItem.rejected, state => {
      state.checklistItemStatus.create = Status.ERROR;
    });

    builder.addCase(deleteChecklistItem.pending, state => {
      state.checklistItemStatus.create = Status.PENDING;
    });
    builder.addCase(deleteChecklistItem.fulfilled, (state, action) => {
      state.checklistItem = state.checklistItem.filter(i => i.checklistItemId !== action.payload);
      state.checklistItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteChecklistItem.rejected, state => {
      state.checklistItemStatus.create = Status.ERROR;
    });
  },
});
export default checklistSlice.reducer;
