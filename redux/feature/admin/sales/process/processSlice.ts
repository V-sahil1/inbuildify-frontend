import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';

import {
  createProcess,
  createStage,
  deleteProcess,
  deleteStage,
  fetchAllProcess,
  fetchAllStage,
  fetchFunctionality,
  updateProcess,
  updateStage,
} from './processThunk';
import { IProcessState } from './IProcessState';

const initialState: IProcessState = {
  process: [],
  stageStatus: {
    create: Status.IDLE,
    fetch: Status.IDLE,
  },
  functionality: [],
  functionalityStatus: Status.IDLE,
  status: {
    create: Status.IDLE,
    fetch: Status.IDLE,
  },
};

const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const process = state.process.find(c => c.salesProcessId === action.payload);
      if (process) {
        process.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(createProcess.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createProcess.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        const process = state.process.find(i => i.isDefault);
        if (process) {
          process.isDefault = false;
        }
      }
      state.process.push({ ...action.payload, isExpanded: false, Stages: [] });
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createProcess.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllProcess.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllProcess.fulfilled, (state, action) => {
      state.process = action.payload.map(process => ({
        ...process,
        isExpanded: false,
        Stages: [],
      }));
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllProcess.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateProcess.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateProcess.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.process = state.process.map(i =>
          i.salesProcessId !== action.payload.salesProcessId
            ? { ...i, isDefault: false }
            : { ...i, ...action.payload }
        );
      } else {
        state.process = state.process.map(i =>
          i.salesProcessId === action.payload.salesProcessId ? { ...i, ...action.payload } : i
        );
      }
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateProcess.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(deleteProcess.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteProcess.fulfilled, (state, action) => {
      state.process = state.process.filter(i => i.salesProcessId !== action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteProcess.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //stages
    builder.addCase(createStage.pending, state => {
      state.stageStatus.create = Status.PENDING;
    });
    builder.addCase(createStage.fulfilled, (state, action) => {
      const process = state.process.find(i => i.salesProcessId === action.payload.salesProcessId);
      if (process) process.Stages = [...process.Stages, action.payload];
      state.stageStatus.create = Status.SUCCESS;
    });
    builder.addCase(createStage.rejected, state => {
      state.stageStatus.create = Status.ERROR;
    });

    builder.addCase(fetchAllStage.pending, state => {
      state.stageStatus.fetch = Status.PENDING;
    });

    builder.addCase(fetchAllStage.fulfilled, (state, action) => {
      const process = state.process.find(i => i.salesProcessId === action.payload.salesProcessId);
      if (process) process.Stages = action.payload.data;
      state.stageStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllStage.rejected, state => {
      state.stageStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateStage.pending, state => {
      state.stageStatus.create = Status.PENDING;
    });
    builder.addCase(updateStage.fulfilled, (state, action) => {
      const process = state.process.find(i => i.salesProcessId === action.payload.salesProcessId);
      if (process) {
        process.Stages = process.Stages.map(i =>
          i.salesStageId === action.payload.salesStageId ? action.payload : i
        );
      }
      state.stageStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateStage.rejected, state => {
      state.stageStatus.create = Status.ERROR;
    });

    builder.addCase(deleteStage.pending, state => {
      state.stageStatus.create = Status.PENDING;
    });
    builder.addCase(deleteStage.fulfilled, (state, action) => {
      const process = state.process.find(i => i.salesProcessId === action.payload.salesProcessId);
      if (process) {
        process.Stages = process.Stages.filter(i => i.salesStageId !== action.payload.id);
      }
      state.stageStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteStage.rejected, state => {
      state.stageStatus.create = Status.ERROR;
    });

    builder.addCase(fetchFunctionality.pending, state => {
      state.functionalityStatus = Status.PENDING;
    });
    builder.addCase(fetchFunctionality.fulfilled, (state, action) => {
      state.functionality = action.payload;
      state.functionalityStatus = Status.SUCCESS;
    });
    builder.addCase(fetchFunctionality.rejected, state => {
      state.functionalityStatus = Status.ERROR;
    });
  },
});
export const { toggleExpand } = processSlice.actions;
export default processSlice.reducer;
