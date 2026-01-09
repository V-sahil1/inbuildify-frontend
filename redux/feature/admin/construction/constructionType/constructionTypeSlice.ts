import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ITypeState } from './IConstructionTypeState';
import { createType, deleteType, fetchAllType, updateType } from './constructionTypeThunk';

const initialState: ITypeState = {
  type: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const typeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createType.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createType.fulfilled, (state, action) => {
      state.type.unshift(action.payload);
      state.pagination.totalRecords = state.pagination.totalRecords + 1;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllType.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllType.fulfilled, (state, action) => {
      state.type = action.payload.constructionTypes;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllType.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateType.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateType.fulfilled, (state, action) => {
      state.type = state.type.map(i =>
        i.constructionTypeId === action.payload.constructionTypeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteType.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteType.fulfilled, (state, action) => {
      state.type = state.type.filter(i => i.constructionTypeId !== action.payload);
      state.pagination.totalRecords = state.pagination.totalRecords - 1;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteType.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default typeSlice.reducer;
