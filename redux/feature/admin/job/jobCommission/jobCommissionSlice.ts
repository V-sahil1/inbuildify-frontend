import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IJobCommissionState } from './IJobCommissionState';
import {
  createCommissionStage,
  createOutgoingCommission,
  deleteCommissionStage,
  deleteOutgoingCommission,
  fetchAllCommissionStage,
  fetchAllOutgoingCommission,
  fetchJobCommissionSetting,
  updateCommissionStage,
  updateJobCommissionSetting,
  updateOutgoingCommission,
} from './jobCommissionThunk';

const initialState: IJobCommissionState = {
  commissionSetting: null,
  outgoingCommission: [],
  incomingCommission: [],
  commissionStageStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  outgoingCommissionStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  incomingCommissionStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobCommissionSlice = createSlice({
  name: 'jobCommission',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const commission = state.outgoingCommission.find(c => c.jobCommissionId === action.payload);
      if (commission) {
        commission.isExpanded = true;
      }
    },
    updateOutgoingList(state, action) {
     state.outgoingCommission = action.payload
    },
    updateIngoingList(state, action) {
     state.incomingCommission = action.payload
    },
  },
  extraReducers: builder => {
    //setting
    builder.addCase(fetchJobCommissionSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobCommissionSetting.fulfilled, (state, action) => {
      state.commissionSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobCommissionSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobCommissionSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobCommissionSetting.fulfilled, (state, action) => {
      state.commissionSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobCommissionSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });

    //outgoing commission
    builder.addCase(createOutgoingCommission.pending, (state, action) => {
      if (action.meta.arg.commissionType === 'outgoing') {
        state.outgoingCommissionStatus.update = Status.PENDING;
      } else {
        state.incomingCommissionStatus.update = Status.PENDING;
      }
    });
    builder.addCase(createOutgoingCommission.fulfilled, (state, action) => {
      if (action.payload.commissionType === 'outgoing') {
        state.outgoingCommission.unshift({ ...action.payload, isExpanded: false, stages: [] });
        state.outgoingCommissionStatus.update = Status.SUCCESS;
      } else {
        state.incomingCommission.unshift(action.payload);
        state.incomingCommissionStatus.update = Status.SUCCESS;
      }
    });
    builder.addCase(createOutgoingCommission.rejected, (state, action) => {
      if (action.meta.arg.commissionType === 'outgoing') {
        state.outgoingCommissionStatus.update = Status.ERROR;
      } else {
        state.incomingCommissionStatus.update = Status.ERROR;
      }
    });

    builder.addCase(fetchAllOutgoingCommission.pending, (state, action) => {
      if (action.meta.arg.commission_type === 'outgoing') {
        state.outgoingCommissionStatus.fetch = Status.PENDING;
      } else {
        state.incomingCommissionStatus.fetch = Status.PENDING;
      }
    });
    builder.addCase(fetchAllOutgoingCommission.fulfilled, (state, action) => {
      if (action.payload.commission_type === 'outgoing') {
        state.outgoingCommission = action.payload.data.jobCommission.map(i => ({
          ...i,
          isExpanded: false,
          stages: [],
        }));
        state.outgoingCommissionStatus.fetch = Status.SUCCESS;
      } else {
        state.incomingCommission = action.payload.data.jobCommission;
        state.incomingCommissionStatus.fetch = Status.SUCCESS;
      }
    });
    builder.addCase(fetchAllOutgoingCommission.rejected, (state, action) => {
      if (action.meta.arg.commission_type === 'outgoing') {
        state.outgoingCommissionStatus.fetch = Status.ERROR;
      } else {
        state.incomingCommissionStatus.fetch = Status.ERROR;
      }
    });

    builder.addCase(updateOutgoingCommission.pending, (state, action) => {
      if (action.meta.arg.commissionType === 'outgoing') {
        state.outgoingCommissionStatus.update = Status.PENDING;
      } else {
        state.incomingCommissionStatus.update = Status.PENDING;
      }
    });
    builder.addCase(updateOutgoingCommission.fulfilled, (state, action) => {
      if (action.payload.commissionType === 'outgoing') {
        state.outgoingCommission = state.outgoingCommission.map(i =>
          i.jobCommissionId === action.payload.data.jobCommissionId ? { ...i, ...action.payload.data } : i
        );
        state.outgoingCommissionStatus.update = Status.SUCCESS;
      } else {
        state.incomingCommission = state.incomingCommission.map(i =>
          i.jobCommissionId === action.payload.data.jobCommissionId ? { ...i, ...action.payload.data } : i
        );
        state.incomingCommissionStatus.update = Status.SUCCESS;
      }
    });
    builder.addCase(updateOutgoingCommission.rejected, (state, action) => {
      if (action.meta.arg.commissionType === 'outgoing') {
        state.outgoingCommissionStatus.update = Status.ERROR;
      } else {
        state.incomingCommissionStatus.update = Status.ERROR;
      }
    });

    builder.addCase(deleteOutgoingCommission.fulfilled, (state, action) => {
      if (action.payload.commissionType === 'outgoing') {
        state.outgoingCommission = state.outgoingCommission.filter(
          i => i.jobCommissionId !== action.payload.id
        );
      } else {
        state.incomingCommission = state.incomingCommission.filter(
          i => i.jobCommissionId !== action.payload.id
        );
      }
    });

    //commission stage
    builder.addCase(createCommissionStage.pending, state => {
      state.commissionStageStatus.update = Status.PENDING;
    });
    builder.addCase(createCommissionStage.fulfilled, (state, action) => {
      const commission = state.outgoingCommission.find(
        i => i.jobCommissionId === action.payload.jobCommissionId
      );
      if (commission) {
        commission.stages = [...commission.stages, action.payload];
      }
      state.commissionStageStatus.update = Status.SUCCESS;
    });

    builder.addCase(fetchAllCommissionStage.pending, state => {
      state.commissionStageStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCommissionStage.fulfilled, (state, action) => {
      const commission = state.outgoingCommission.find(
        i => i.jobCommissionId === action.payload.id
      );
      if (commission) {
        commission.stages = action.payload.data.records;
      }
      state.commissionStageStatus.fetch = Status.SUCCESS;
    });

    builder.addCase(updateCommissionStage.pending, state => {
      state.commissionStageStatus.update = Status.PENDING;
    });
    builder.addCase(updateCommissionStage.fulfilled, (state, action) => {
      const commission = state.outgoingCommission.find(
        i => i.jobCommissionId === action.payload.commissionId
      );
      if (commission) {
        commission.stages = commission.stages.map(i =>
          i.jobCommissionSubStageId === action.payload.data.jobCommissionSubStageId
            ? action.payload.data
            : i
        );
      }
      state.commissionStageStatus.update = Status.SUCCESS;
    });

    builder.addCase(deleteCommissionStage.fulfilled, (state, action) => {
      const commission = state.outgoingCommission.find(
        i => i.jobCommissionId === action.payload.commissionId
      );
      if (commission) {
        commission.stages = commission.stages.filter(
          i => i.jobCommissionSubStageId !== action.payload.id
        );
      }
    });
  },
});
export const { toggleExpand, updateOutgoingList, updateIngoingList } = JobCommissionSlice.actions;
export default JobCommissionSlice.reducer;
