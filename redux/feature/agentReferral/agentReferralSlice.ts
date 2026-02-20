import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IAgentReferralPartnerState } from './IAgentReferralState';
import {
  createAgentReferral,
  deleteAgentReferral,
  fetchAllAgentReferral,
  updateAgentReferral,
} from './agentReferralThunk';
import {
  resetUserPasswordThunk,
  updateUserLockThunk,
  updateUserLoginIdThunk,
} from '../user/userThunk';

const initialState: IAgentReferralPartnerState = {
  agentReferralPartner: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const agentReferralSlice = createSlice({
  name: 'agentReferralPartner',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createAgentReferral.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createAgentReferral.fulfilled, (state, action) => {
      state.agentReferralPartner.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createAgentReferral.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllAgentReferral.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllAgentReferral.fulfilled, (state, action) => {
      state.agentReferralPartner = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllAgentReferral.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateAgentReferral.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateAgentReferral.fulfilled, (state, action) => {
      state.agentReferralPartner = state.agentReferralPartner.map(contact =>
        contact.agentReferralPartnerId === action.payload.agentReferralPartnerId
          ? action.payload
          : contact
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateAgentReferral.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteAgentReferral.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteAgentReferral.fulfilled, (state, action) => {
      state.agentReferralPartner = state.agentReferralPartner.filter(
        contact => contact.agentReferralPartnerId !== action.meta.arg
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteAgentReferral.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateUserLockThunk.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateUserLockThunk.fulfilled, (state, action) => {
      if (action.meta.arg.type === 'agentReferral') {
        const index = state.agentReferralPartner.findIndex(
          user => user.user.userId === action.meta.arg.id
        );
        if (index !== -1) {
          const { isLocked } = action.payload;
          state.agentReferralPartner[index] = {
            ...state.agentReferralPartner[index],
            user: { ...state.agentReferralPartner[index].user, isLocked },
          };
        }
        state.status.create = Status.SUCCESS;
      }
    });
    builder.addCase(updateUserLockThunk.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(resetUserPasswordThunk.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(resetUserPasswordThunk.fulfilled, (state, action) => {
      if (action.meta.arg.type === 'agentReferral') {
        state.status.create = Status.SUCCESS;
      }
    });
    builder.addCase(resetUserPasswordThunk.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(updateUserLoginIdThunk.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateUserLoginIdThunk.fulfilled, (state, action) => {
      if (action.meta.arg.type === 'agentReferral') {
        const index = state.agentReferralPartner.findIndex(
          user => user.user.userId === action.meta.arg.id
        );
        if (index !== -1) {
          const { loginId } = action.payload;
          state.agentReferralPartner[index] = {
            ...state.agentReferralPartner[index],
            user: { ...state.agentReferralPartner[index].user, loginId },
          };
        }
        state.status.create = Status.SUCCESS;
      }
    });
    builder.addCase(updateUserLoginIdThunk.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});

export default agentReferralSlice.reducer;
