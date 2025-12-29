import { createSlice } from '@reduxjs/toolkit';
import { createUserThunk, getInvitedUsersThunk, getUsersThunk } from './userThunk';
import { UserInitialState } from './UserState';
import { Status } from '@lib/constants/enum';

const initialState: UserInitialState = {
  users: [],
  invitedUsers: [],
  status: {
    users: Status.IDLE,
    invitedUsers: Status.IDLE,
  },
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsersThunk.pending, state => {
      state.status.users = Status.PENDING;
    });
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      state.status.users = Status.SUCCESS;
      state.users = action.payload.users;
    });
    builder.addCase(getUsersThunk.rejected, state => {
      state.status.users = Status.ERROR;
    });
    builder.addCase(getInvitedUsersThunk.pending, state => {
      state.status.invitedUsers = Status.PENDING;
    });
    builder.addCase(getInvitedUsersThunk.fulfilled, (state, action) => {
      state.invitedUsers = action.payload?.users || [];
      state.status.invitedUsers = Status.SUCCESS;
    });
    builder.addCase(getInvitedUsersThunk.rejected, state => {
      state.status.invitedUsers = Status.ERROR;
    });
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      const user = state.invitedUsers.find(user => user.inviteId === action.payload?.inviteId);
      if (!user) state.invitedUsers.unshift(action.payload);
    });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
