import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import {
  createCostCenter,
  createCostCenterChecklist,
  deleteCostCenter,
  deleteCostCenterChecklist,
  fetchAllCostCenter,
  fetchAllCostCenterChecklist,
  updateCostCenter,
} from './costCenterThunk';
import { ICostCenterState } from './IcostCenterState';

const initialState: ICostCenterState = {
  costCenter: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  checklistStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const costCenterSlice = createSlice({
  name: 'costCenter',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllCostCenter.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCostCenter.fulfilled, (state, action) => {
      state.costCenter = action.payload.map(i => ({ ...i, checklist: [] })) ;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllCostCenter.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(createCostCenter.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createCostCenter.fulfilled, (state, action) => {
      state.costCenter.unshift({ ...action.payload, checklist: [] });
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createCostCenter.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateCostCenter.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateCostCenter.fulfilled, (state, action) => {
      if (!action.payload.status) {
        state.costCenter=state.costCenter.map(i => i.costCenterId === action.payload.costCenterId ? action.payload : i);
        const center = state.costCenter.find(i => i.costCenterId === action.payload.costCenterId);
        if (center) {
          center.checklist = [];
        }
      } else {
        state.costCenter = state.costCenter.map(costCenter =>
          costCenter.costCenterId === action.payload.costCenterId
            ? { ...costCenter, ...action.payload }
            : costCenter
        );
      }
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateCostCenter.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteCostCenter.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteCostCenter.fulfilled, (state, action) => {
      state.costCenter = state.costCenter.filter(
        costCenter => costCenter.costCenterId !== action.payload
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteCostCenter.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //map checklist
    builder.addCase(fetchAllCostCenterChecklist.fulfilled, (state, action) => {
      const center = state.costCenter.find(i => i.costCenterId === action.meta.arg);
      if (center) {
        center.checklist = action.payload;
      }
      state.checklistStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(createCostCenterChecklist.fulfilled, (state, action) => {
      const center = state.costCenter.find(i => i.costCenterId === action.payload.costCenterId);
      if (center) {
        center.checklist.push(action.payload);
      }
      state.checklistStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteCostCenterChecklist.fulfilled, (state, action) => {
      const center = state.costCenter.find(i => i.costCenterId === action.payload.costCenterId);
      if (center) {
        center.checklist = center.checklist.filter(i => i.id !== action.payload.id);
      }
      state.checklistStatus.create = Status.SUCCESS;
    });
  },
});
export default costCenterSlice.reducer;
