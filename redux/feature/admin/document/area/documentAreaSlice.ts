import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import { IDocumentAreaState } from './IDocumentAreaState';
import {
  createDocumentArea,
  createDocumentSubFolder,
  deleteDocumentArea,
  deleteDocumentSubFolder,
  fetchAllDocumentArea,
  fetchAllDocumentSubFolder,
  updateDocumentArea,
  updateDocumentSubFolder,
} from './documentAreaThunk';

const initialState: IDocumentAreaState = {
  commonFolder: [],
  subFolderStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const documentAreaSlice = createSlice({
  name: 'documentArea',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const folder = state.commonFolder.find(c => c.documentCommonFolderId === action.payload);
      if (folder) {
        folder.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    //common folder
    builder.addCase(createDocumentArea.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createDocumentArea.fulfilled, (state, action) => {
      state.commonFolder.unshift({
        ...action.payload,
        isExpanded: false,
        subFolder: [],
      });
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createDocumentArea.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllDocumentArea.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllDocumentArea.fulfilled, (state, action) => {
      state.commonFolder = action.payload.folders.map(i => ({
        ...i,
        isExpanded: false,
        subFolder: [],
      }));
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllDocumentArea.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateDocumentArea.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateDocumentArea.fulfilled, (state, action) => {
      state.commonFolder = state.commonFolder.map(i =>
        i.documentCommonFolderId === action.payload.documentCommonFolderId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateDocumentArea.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteDocumentArea.pending, (state, action) => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteDocumentArea.fulfilled, (state, action) => {
      state.commonFolder = state.commonFolder.filter(
        i => i.documentCommonFolderId !== action.payload
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteDocumentArea.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //sub folder

    builder.addCase(createDocumentSubFolder.pending, state => {
      state.subFolderStatus.create = Status.PENDING;
    });
    builder.addCase(createDocumentSubFolder.fulfilled, (state, action) => {
      const folder = state.commonFolder.find(
        i => i.documentCommonFolderId === action.payload.documentCommonFolderId
      );
      if (folder) {
        folder.subFolder.push(action.payload);
      }
      state.subFolderStatus.create = Status.SUCCESS;
    });
    builder.addCase(createDocumentSubFolder.rejected, state => {
      state.subFolderStatus.create = Status.ERROR;
    });
    builder.addCase(fetchAllDocumentSubFolder.pending, state => {
      state.subFolderStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllDocumentSubFolder.fulfilled, (state, action) => {
      const folder = state.commonFolder.find(
        i => i.documentCommonFolderId === action.payload.commonFolderId
      );
      if (folder) {
        folder.subFolder = action.payload.data.records;
      }
      state.subFolderStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllDocumentSubFolder.rejected, state => {
      state.subFolderStatus.fetch = Status.ERROR;
    });
    builder.addCase(updateDocumentSubFolder.pending, state => {
      state.subFolderStatus.create = Status.PENDING;
    });
    builder.addCase(updateDocumentSubFolder.fulfilled, (state, action) => {
      const folder = state.commonFolder.find(
        i => i.documentCommonFolderId === action.payload.documentCommonFolderId
      );
      if (folder) {
        folder.subFolder = folder.subFolder.map(i =>
          i.documentCommonSubfolderId === action.payload.documentCommonSubfolderId
            ? action.payload
            : i
        );
      }
      state.subFolderStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateDocumentSubFolder.rejected, state => {
      state.subFolderStatus.create = Status.ERROR;
    });
    builder.addCase(deleteDocumentSubFolder.pending, state => {
      state.subFolderStatus.create = Status.PENDING;
    });
    builder.addCase(deleteDocumentSubFolder.fulfilled, (state, action) => {
      const folder = state.commonFolder.find(
        i => i.documentCommonFolderId === action.payload.commonFolderId
      );
      if (folder) {
        folder.subFolder = folder.subFolder.filter(
          i => i.documentCommonSubfolderId !== action.payload.id
        );
      }
      state.subFolderStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteDocumentSubFolder.rejected, state => {
      state.subFolderStatus.create = Status.ERROR;
    });
  },
});
export const { toggleExpand } = documentAreaSlice.actions;
export default documentAreaSlice.reducer;
