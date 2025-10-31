import { Status } from '@lib/constants/enum';
import { createSlice } from '@reduxjs/toolkit';
import { getActionsThunk, getActionTags } from './actionThunk';

export const actionSlice = createSlice({
  name: 'action',
  initialState: {
    actions: [],
    tags: [],
    tagStatus: Status.IDLE,
    status: Status.IDLE,
  },
  reducers: {},
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
  },
});

export default actionSlice.reducer;
