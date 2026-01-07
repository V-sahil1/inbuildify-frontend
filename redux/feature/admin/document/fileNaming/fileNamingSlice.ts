import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { IFileNamingState } from './IFileNamingState';
import {
  createFileNaming,
  createFileNamingFormat,
  deleteFileNaming,
  fetchAllFileNaming,
  fetchAllFileNamingFormat,
  updateFileNaming,
} from './fileNamingThunk';

const initialState: IFileNamingState = {
  files: [],
  namingFormat: '',
  namingFormatStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const fileNamingSlice = createSlice({
  name: 'fileNaming',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createFileNaming.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createFileNaming.fulfilled, (state, action) => {
      state.files.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createFileNaming.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllFileNaming.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllFileNaming.fulfilled, (state, action) => {
      state.files = action.payload.records;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllFileNaming.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateFileNaming.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateFileNaming.fulfilled, (state, action) => {
      state.files = state.files.map(i =>
        i.documentFileNamingRuleId === action.payload.documentFileNamingRuleId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateFileNaming.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteFileNaming.pending, (state, action) => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteFileNaming.fulfilled, (state, action) => {
      state.files = state.files.filter(i => i.documentFileNamingRuleId !== action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteFileNaming.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //file naming format

    builder.addCase(createFileNamingFormat.pending, (state, action) => {
      state.namingFormatStatus.create = Status.PENDING;
    });
    builder.addCase(createFileNamingFormat.fulfilled, (state, action) => {
      state.namingFormat = action.payload.namingFormat;
      state.namingFormatStatus.create = Status.SUCCESS;
    });
    builder.addCase(fetchAllFileNamingFormat.pending, (state, action) => {
      state.namingFormatStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllFileNamingFormat.fulfilled, (state, action) => {
      state.namingFormat = action.payload.namingFormat;
      state.namingFormatStatus.fetch = Status.SUCCESS;
    });
  },
});
export default fileNamingSlice.reducer;
