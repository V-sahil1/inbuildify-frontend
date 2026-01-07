import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { fetchFolderMapping, updateFolderMapping } from './folderMappingThunk';
import { IFolderMappingState } from './IFolderMappingState';

const initialState: IFolderMappingState = {
  folderMapping: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const folderMappingSlice = createSlice({
  name: 'folderMapping',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchFolderMapping.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchFolderMapping.fulfilled, (state, action) => {
      state.folderMapping = action.payload.records;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchFolderMapping.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateFolderMapping.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateFolderMapping.fulfilled, (state, action) => {
      state.folderMapping = action.payload;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateFolderMapping.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default folderMappingSlice.reducer;
