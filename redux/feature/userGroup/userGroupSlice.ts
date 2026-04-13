import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { createUserGroup, fetchAllUserGroup, updateUserGroup } from './userGroupThunk';
import { IUserGroupState } from './IUserGroupState';

const initialState: IUserGroupState = {
  userGroups: [],
  pagination: {
    currentPage: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0,
  },
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const userGroupSlice = createSlice({
  name: 'userGroup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createUserGroup.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createUserGroup.fulfilled, (state, action) => {
      state.userGroups.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createUserGroup.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllUserGroup.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllUserGroup.fulfilled, (state, action) => {
      state.userGroups = action.payload.append
        ? [...state.userGroups, ...action.payload.userGroups]
        : action.payload.userGroups;
      state.pagination = action.payload.pagination || state.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllUserGroup.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateUserGroup.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateUserGroup.fulfilled, (state, action) => {
      state.userGroups = state.userGroups.map(i =>
        i.userGroupId === action.payload.userGroupId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateUserGroup.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default userGroupSlice.reducer;
