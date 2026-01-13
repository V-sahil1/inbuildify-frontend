import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { IETSRechargeSetting, IETSRechargeState } from './ETSRechargeState';
import {
  createETSRehargeItem,
  deleteETSRehargeItem,
  fetchAllETSRehargeItem,
  fetchETSRechargeSetting,
  updateETSRechargeSetting,
  updateETSRehargeItem,
} from './ETSRechargeThunk';

const initialState: IETSRechargeState = {
  setting: <IETSRechargeSetting>{},
  etsItems: [],
  etsItemStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const ETSRehargeSlice = createSlice({
  name: 'ETSRecharge',
  initialState,
  reducers: {},
  extraReducers: builder => {
    //ets recharge setting
    builder.addCase(updateETSRechargeSetting.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateETSRechargeSetting.fulfilled, (state, action) => {
      state.setting = action.payload;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateETSRechargeSetting.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchETSRechargeSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchETSRechargeSetting.fulfilled, (state, action) => {
      state.setting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchETSRechargeSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    //ets reharge item
    builder.addCase(createETSRehargeItem.pending, state => {
      state.etsItemStatus.create = Status.PENDING;
    });
    builder.addCase(createETSRehargeItem.fulfilled, (state, action) => {
      state.etsItems.unshift(action.payload);
      state.etsItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(createETSRehargeItem.rejected, state => {
      state.etsItemStatus.create = Status.ERROR;
    });
    builder.addCase(fetchAllETSRehargeItem.pending, state => {
      state.etsItemStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllETSRehargeItem.fulfilled, (state, action) => {
      state.etsItems = action.payload.approvals;
      state.etsItemStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllETSRehargeItem.rejected, state => {
      state.etsItemStatus.fetch = Status.ERROR;
    });
    builder.addCase(updateETSRehargeItem.pending, state => {
      state.etsItemStatus.create = Status.PENDING;
    });
    builder.addCase(updateETSRehargeItem.fulfilled, (state, action) => {
      state.etsItems = state.etsItems.map(i =>
        i.constructionEtsRechargeApprovalId === action.payload.constructionEtsRechargeApprovalId
          ? action.payload
          : i
      );
      state.etsItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateETSRehargeItem.rejected, state => {
      state.etsItemStatus.create = Status.ERROR;
    });
    builder.addCase(deleteETSRehargeItem.pending, state => {
      state.etsItemStatus.create = Status.PENDING;
    });
    builder.addCase(deleteETSRehargeItem.fulfilled, (state, action) => {
      state.etsItems = state.etsItems.filter(
        i => i.constructionEtsRechargeApprovalId !== action.payload
      );
      state.etsItemStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteETSRehargeItem.rejected, state => {
      state.etsItemStatus.create = Status.ERROR;
    });
  },
});
export default ETSRehargeSlice.reducer;
