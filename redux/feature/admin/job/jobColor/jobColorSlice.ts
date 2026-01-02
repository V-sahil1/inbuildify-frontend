import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createJobColorSection,
  deleteJobColorSection,
  fetchJobColor,
  fetchJobColorColumn,
  fetchJobColorSection,
  updateJobColor,
  updateJobColorColumn,
  updateJobColorSection,
} from './jobColorThunk';
import { IJobColorState } from './IJobColorState';

const initialState: IJobColorState = {
  jobColor: null,
  jobColorColumn: [],
  jobColorSection: [],
  jobColorColumnStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  jobColorSectionStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobColorSlice = createSlice({
  name: 'jobColor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobColor.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobColor.fulfilled, (state, action) => {
      state.jobColor = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobColor.rejected, (state, action) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobColor.pending, (state, action) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobColor.fulfilled, (state, action) => {
      state.jobColor = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobColor.rejected, (state, action) => {
      state.status.update = Status.ERROR;
    });

    //color column

    builder.addCase(fetchJobColorColumn.pending, state => {
      state.jobColorColumnStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobColorColumn.fulfilled, (state, action) => {
      state.jobColorColumn = action.payload.jobColorColumn;
      state.jobColorColumnStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobColorColumn.rejected, state => {
      state.jobColorColumnStatus.fetch = Status.ERROR;
    });
    builder.addCase(updateJobColorColumn.pending, state => {
      state.jobColorColumnStatus.update = Status.PENDING;
    });
    builder.addCase(updateJobColorColumn.fulfilled, (state, action) => {
      state.jobColorColumn = state.jobColorColumn.map(i =>
        i.jobColorColumnId === action.payload.jobColorColumnId ? action.payload : i
      );
      state.jobColorColumnStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateJobColorColumn.rejected, state => {
      state.jobColorColumnStatus.update = Status.ERROR;
    });

    //color custom section

    builder.addCase(createJobColorSection.pending, state => {
      state.jobColorSectionStatus.update = Status.PENDING;
    });
    builder.addCase(createJobColorSection.fulfilled, (state, action) => {
      state.jobColorSection.unshift(action.payload);
      state.jobColorSectionStatus.update = Status.SUCCESS;
    });
    builder.addCase(createJobColorSection.rejected, state => {
      state.jobColorSectionStatus.update = Status.ERROR;
    });
    builder.addCase(fetchJobColorSection.pending, state => {
      state.jobColorSectionStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobColorSection.fulfilled, (state, action) => {
      state.jobColorSection = action.payload.JobColorColumnSections;
      state.jobColorSectionStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobColorSection.rejected, state => {
      state.jobColorSectionStatus.fetch = Status.ERROR;
    });
    builder.addCase(updateJobColorSection.pending, state => {
      state.jobColorSectionStatus.update = Status.PENDING;
    });
    builder.addCase(updateJobColorSection.fulfilled, (state, action) => {
      state.jobColorSection = state.jobColorSection.map(i =>
        i.jobColorColumnSectionId === action.payload.jobColorColumnSectionId ? action.payload : i
      );
      state.jobColorSectionStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateJobColorSection.rejected, state => {
      state.jobColorSectionStatus.update = Status.ERROR;
    });
    builder.addCase(deleteJobColorSection.fulfilled, (state, action) => {
      state.jobColorSection = state.jobColorSection.filter(
        i => i.jobColorColumnSectionId !== action.payload.id
      );
    });
  },
});
export default JobColorSlice.reducer;
