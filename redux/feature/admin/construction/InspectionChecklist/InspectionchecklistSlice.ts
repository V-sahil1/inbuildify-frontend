import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { InspectionChecklistState } from './InspectionChecklistState';
import {
  createInspectionChecklist,
  deleteInspectionChecklist,
  fetchAllInspectionChecklist,
  fetchAllInspectionSection,
  updateInspectionChecklist,
} from './InspectionChecklistThunk';

const initialState: InspectionChecklistState = {
  inspectionSection: [],
  status: {
    checklistStatus: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    sectionStatus: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const inspectionCheckListSlice = createSlice({
  name: 'inspectionChecklist',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const section = state.inspectionSection.find(
        c => c.constructionInspectionChecklistId === action.payload
      );
      if (section) {
        section.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(createInspectionChecklist.pending, (state, action) => {
      if (action.meta.arg.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.PENDING;
      } else {
        state.status.sectionStatus.create = Status.PENDING;
      }
    });
    builder.addCase(createInspectionChecklist.fulfilled, (state, action) => {
      if (action.payload.fieldName === 'checklist') {
        const section = state.inspectionSection.find(
          s => s.constructionInspectionChecklistId === action.payload.sectionId
        );
        if (section) {
          section.checklist?.push(action.payload);
        }
        state.status.checklistStatus.create = Status.SUCCESS;
      } else {
        state.inspectionSection.unshift({
          ...action.payload,
          isExpanded: false,
          checklist: [],
        });
        state.status.sectionStatus.create = Status.SUCCESS;
      }
    });
    builder.addCase(createInspectionChecklist.rejected, (state, action) => {
      if (action.meta.arg.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.ERROR;
      } else {
        state.status.sectionStatus.create = Status.ERROR;
      }
    });
    builder.addCase(fetchAllInspectionSection.pending, (state, action) => {
      state.status.sectionStatus.create = Status.ERROR;
    });
    builder.addCase(fetchAllInspectionSection.fulfilled, (state, action) => {
      if (action.payload.fieldName === 'section') {
        state.inspectionSection = action.payload.data.map(i => ({
          ...i,
          isExpanded: false,
          checklist: [],
        }));
      }
    });
    builder.addCase(fetchAllInspectionSection.rejected, state => {
      state.status.sectionStatus.fetch = Status.ERROR;
    });

    builder.addCase(fetchAllInspectionChecklist.pending, state => {
      state.status.checklistStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllInspectionChecklist.fulfilled, (state, action) => {
      if (action.payload.fieldName === 'checklist') {
        const section = state.inspectionSection.find(
          i => i.constructionInspectionChecklistId === action.payload.id
        );
        if (section) {
          section.checklist = action.payload.data;
        }
      }
      state.status.checklistStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllInspectionChecklist.rejected, state => {
      state.status.checklistStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateInspectionChecklist.pending, (state, action) => {
      if (action.meta.arg.data.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.PENDING;
      } else {
        state.status.sectionStatus.create = Status.PENDING;
      }
    });
    builder.addCase(updateInspectionChecklist.fulfilled, (state, action) => {
      if (action.payload.data.fieldName === 'checklist') {
        const section = state.inspectionSection.find(
          i => i.constructionInspectionChecklistId === action.payload.sectionId
        );
        if (section) {
          const checklist = section.checklist?.find(
            i =>
              i.constructionInspectionChecklistId ===
              action.payload.data.constructionInspectionChecklistId
          );
          if (checklist && checklist.sectionId !== action.payload.data.sectionId) {
            // Remove from old section
            section.checklist = section.checklist.filter(
              i =>
                i.constructionInspectionChecklistId !==
                action.payload.data.constructionInspectionChecklistId
            );
            // Add to new section
            const newSection = state.inspectionSection.find(
              i => i.constructionInspectionChecklistId === action.payload.data.sectionId
            );
            if (newSection) {
              newSection.checklist.push(action.payload.data);
            }
          } else {
            section.checklist = section.checklist.map(i =>
              i.constructionInspectionChecklistId ===
              action.payload.data.constructionInspectionChecklistId
                ? action.payload.data
                : i
            );
          }
        }
        state.status.checklistStatus.create = Status.SUCCESS;
      } else {
        state.inspectionSection = state.inspectionSection.map(i =>
          i.constructionInspectionChecklistId ===
          action.payload.data.constructionInspectionChecklistId
            ? action.payload.data
            : i
        );
        state.status.sectionStatus.create = Status.SUCCESS;
      }
    });
    builder.addCase(updateInspectionChecklist.rejected, (state, action) => {
      if (action.meta.arg.data.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.ERROR;
      } else {
        state.status.sectionStatus.create = Status.ERROR;
      }
    });

    builder.addCase(deleteInspectionChecklist.pending, (state, action) => {
      if (action.meta.arg.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.PENDING;
      } else {
        state.status.sectionStatus.create = Status.PENDING;
      }
    });
    builder.addCase(deleteInspectionChecklist.fulfilled, (state, action) => {
      if (action.payload.fieldName === 'checklist') {
        const section = state.inspectionSection.find(
          i => i.constructionInspectionChecklistId === action.payload.sectionId
        );
        if (section) {
          section.checklist = section.checklist.filter(
            i => i.constructionInspectionChecklistId !== action.payload.id
          );
        }
      } else {
        state.inspectionSection = state.inspectionSection.filter(
          i => i.constructionInspectionChecklistId !== action.payload.sectionId
        );
      }
      state.status.checklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteInspectionChecklist.rejected, (state, action) => {
      if (action.meta.arg.fieldName === 'checklist') {
        state.status.checklistStatus.create = Status.ERROR;
      } else {
        state.status.sectionStatus.create = Status.ERROR;
      }
    });
  },
});
export const { toggleExpand } = inspectionCheckListSlice.actions;
export default inspectionCheckListSlice.reducer;
