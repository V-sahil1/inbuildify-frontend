import { createSlice } from '@reduxjs/toolkit';
import {
  createUserThunk,
  getUsersThunk,
  resetUserPasswordThunk,
  updateUserLockThunk,
  updateUserLoginIdThunk,
  updateUserStatusThunk,
  updateUserThunk,
} from './userThunk';
import { UserInitialState } from './UserState';
import { Status } from '@lib/constants/enum';

const initialState: UserInitialState = {
  users: [],
  invitedUsers: [],
  status: {
    users: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    invitedUsers: Status.IDLE,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsersThunk.pending, state => {
      state.status.users.fetch = Status.PENDING;
    });
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      state.status.users.fetch = Status.SUCCESS;
      state.users = action.payload;
    });
    builder.addCase(getUsersThunk.rejected, state => {
      state.status.users.fetch = Status.ERROR;
    });

    builder.addCase(createUserThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      state.users.unshift(action.payload);
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(createUserThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    builder.addCase(updateUserThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.users = state.users.map(i =>
        i.usersId === action.payload.usersId ? action.payload : i
      );
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(updateUserThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    builder.addCase(updateUserLockThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(updateUserLockThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(user => user.usersId === action.payload.usersId);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(updateUserLockThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    builder.addCase(updateUserStatusThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(updateUserStatusThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(user => user.usersId === action.payload.usersId);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(updateUserStatusThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    builder.addCase(updateUserLoginIdThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(updateUserLoginIdThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(user => user.usersId === action.payload.usersId);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(updateUserLoginIdThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    builder.addCase(resetUserPasswordThunk.pending, state => {
      state.status.users.create = Status.PENDING;
    });
    builder.addCase(resetUserPasswordThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(user => user.usersId === action.payload.usersId);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
      state.status.users.create = Status.SUCCESS;
    });
    builder.addCase(resetUserPasswordThunk.rejected, state => {
      state.status.users.create = Status.ERROR;
    });

    // builder.addCase(getInvitedUsersThunk.pending, state => {
    //   state.status.invitedUsers = Status.PENDING;
    // });
    // builder.addCase(getInvitedUsersThunk.fulfilled, (state, action) => {
    //   state.invitedUsers = action.payload?.users || [];
    //   state.status.invitedUsers = Status.SUCCESS;
    // });
    // builder.addCase(getInvitedUsersThunk.rejected, state => {
    //   state.status.invitedUsers = Status.ERROR;
    // });
    // builder.addCase(createUserThunk.fulfilled, (state, action) => {
    //   const user = state.invitedUsers.find(user => user.inviteId === action.payload?.inviteId);
    //   if (!user) state.invitedUsers.unshift(action.payload);
    // });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
