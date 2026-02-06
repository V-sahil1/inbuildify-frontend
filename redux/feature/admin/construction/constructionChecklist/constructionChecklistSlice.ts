import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import {
  createConstructionChecklist,
  fetchAllConstructionChecklist,
  updateConstructionChecklist,
  deleteConstructionChecklist,
  createSubChecklist,
  fetchAllSubChecklist,
  updateSubChecklist,
  deleteSubChecklist,
  createChecklistPredecessor,
  fetchAllChecklistPredecessor,
  updateChecklistPredecessor,
  deleteChecklistPredecessor,
} from './constructionChecklistThunk';
import { IConstructionChecklistState } from './IConstructionChecklistState';

const initialState: IConstructionChecklistState = {
  checklist: [],
  status: {
    checklistStatus: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    subChecklistStatus: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    predecessorStatus: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const constructionChecklistSlice = createSlice({
  name: 'constructionChecklist',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const checklist = state.checklist.find(c => c.constructionChecklistId === action.payload);
      if (checklist) {
        checklist.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    // Construction Checklist
    builder.addCase(createConstructionChecklist.pending, state => {
      state.status.checklistStatus.create = Status.PENDING;
    });
    builder.addCase(createConstructionChecklist.fulfilled, (state, action) => {
      state.checklist.unshift({
        ...action.payload,
        isExpanded: false,
        subChecklist: [],
        predecessor: [],
      });
      state.status.checklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(createConstructionChecklist.rejected, state => {
      state.status.checklistStatus.create = Status.ERROR;
    });

    builder.addCase(fetchAllConstructionChecklist.pending, state => {
      state.status.checklistStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllConstructionChecklist.fulfilled, (state, action) => {
      state.checklist = action.payload.map(item => ({
        ...item,
        isExpanded: false,
        subChecklist: [],
      }));
      state.status.checklistStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllConstructionChecklist.rejected, state => {
      state.status.checklistStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateConstructionChecklist.pending, state => {
      state.status.checklistStatus.create = Status.PENDING;
    });
    builder.addCase(updateConstructionChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.map(item =>
        item.constructionChecklistId === action.payload.constructionChecklistId
          ? { ...item, ...action.payload }
          : item
      );
      state.status.checklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateConstructionChecklist.rejected, state => {
      state.status.checklistStatus.create = Status.ERROR;
    });

    builder.addCase(deleteConstructionChecklist.pending, state => {
      state.status.checklistStatus.create = Status.PENDING;
    });
    builder.addCase(deleteConstructionChecklist.fulfilled, (state, action) => {
      state.checklist = state.checklist.filter(
        item => item.constructionChecklistId !== action.payload
      );
      state.status.checklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteConstructionChecklist.rejected, state => {
      state.status.checklistStatus.create = Status.ERROR;
    });

    // Sub Checklist
    builder.addCase(createSubChecklist.pending, state => {
      state.status.subChecklistStatus.create = Status.PENDING;
    });
    builder.addCase(createSubChecklist.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.constructionChecklistId
      );
      if (parent) {
        parent.subChecklist.push(action.payload);
      }
      state.status.subChecklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(createSubChecklist.rejected, state => {
      state.status.subChecklistStatus.create = Status.ERROR;
    });

    builder.addCase(fetchAllSubChecklist.pending, state => {
      state.status.subChecklistStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSubChecklist.fulfilled, (state, action) => {
      // Update subchecklists for each parent
      const checklist = state.checklist.find(
        i => i.constructionChecklistId === action.payload.checklistId
      );
      if (checklist) {
        checklist.subChecklist = action.payload.data;
      }
      state.status.subChecklistStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSubChecklist.rejected, state => {
      state.status.subChecklistStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateSubChecklist.pending, state => {
      state.status.subChecklistStatus.create = Status.PENDING;
    });
    builder.addCase(updateSubChecklist.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.constructionChecklistId
      );
      if (parent) {
        parent.subChecklist = parent.subChecklist.map(item =>
          item.constructionSubChecklistId === action.payload.constructionSubChecklistId
            ? action.payload
            : item
        );
      }
      state.status.subChecklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateSubChecklist.rejected, state => {
      state.status.subChecklistStatus.create = Status.ERROR;
    });

    builder.addCase(deleteSubChecklist.pending, state => {
      state.status.subChecklistStatus.create = Status.PENDING;
    });
    builder.addCase(deleteSubChecklist.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.checklistId
      );
      if (parent && parent.subChecklist) {
        parent.subChecklist = parent.subChecklist.filter(
          item => item.constructionSubChecklistId !== action.payload.id
        );
      }
      state.status.subChecklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteSubChecklist.rejected, state => {
      state.status.subChecklistStatus.create = Status.ERROR;
    });

    // Checklist Predecessor
    builder.addCase(createChecklistPredecessor.pending, state => {
      state.status.predecessorStatus.create = Status.PENDING;
    });
    builder.addCase(createChecklistPredecessor.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.constructionChecklistId
      );
      if (parent) {
        if (!parent.predecessor) {
          parent.predecessor = [];
        }
        parent.predecessor.push(action.payload);
      }
      state.status.predecessorStatus.create = Status.SUCCESS;
    });
    builder.addCase(createChecklistPredecessor.rejected, state => {
      state.status.predecessorStatus.create = Status.ERROR;
    });

    builder.addCase(fetchAllChecklistPredecessor.pending, state => {
      state.status.predecessorStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllChecklistPredecessor.fulfilled, (state, action) => {
      const checklist = state.checklist.find(
        i => i.constructionChecklistId === action.payload.checklistId
      );
      if (checklist) {
        checklist.predecessor = action.payload.data;
      }
      state.status.predecessorStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllChecklistPredecessor.rejected, state => {
      state.status.predecessorStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateChecklistPredecessor.pending, state => {
      state.status.predecessorStatus.create = Status.PENDING;
    });
    builder.addCase(updateChecklistPredecessor.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.constructionChecklistId
      );
      if (parent && parent.predecessor) {
        parent.predecessor = parent.predecessor.map(item =>
          item.constructionChecklistPredecessorId ===
          action.payload.constructionChecklistPredecessorId
            ? action.payload
            : item
        );
      }
      state.status.predecessorStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateChecklistPredecessor.rejected, state => {
      state.status.predecessorStatus.create = Status.ERROR;
    });

    builder.addCase(deleteChecklistPredecessor.pending, state => {
      state.status.predecessorStatus.create = Status.PENDING;
    });
    builder.addCase(deleteChecklistPredecessor.fulfilled, (state, action) => {
      const parent = state.checklist.find(
        c => c.constructionChecklistId === action.payload.checklistId
      );
      if (parent && parent.predecessor) {
        parent.predecessor = parent.predecessor.filter(
          item => item.constructionChecklistPredecessorId !== action.payload.id
        );
      }
      state.status.predecessorStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteChecklistPredecessor.rejected, state => {
      state.status.predecessorStatus.create = Status.ERROR;
    });
  },
});
export const { toggleExpand } = constructionChecklistSlice.actions;
export default constructionChecklistSlice.reducer;
