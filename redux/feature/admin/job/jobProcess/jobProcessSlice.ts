import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createJobProcessStages,
  deleteJobProcessStage,
  fetchJobProcessFunctionality,
  fetchJobProcessStages,
  updateJobProcessStages,
  fetchJobProcessSubStages,
  createJobProcessSubStages,
  updateJobProcessSubStages,
  deleteJobProcessSubStages,
} from './jobProcessThunk';
import { IJobSettingState } from './IJobProcessState';

const initialState: IJobSettingState = {
  jobProcessFunctionality: [],
  jobProcessStage: [],
  jobProcessSubStage: [],
  jobProcessTask: [],
  jobProcessSubTask: [],
  status: {
    fetchFunctionality: Status.IDLE,
    stage: {
      fetch: Status.IDLE,
      update: Status.IDLE,
      create: Status.IDLE,
      delete: Status.IDLE,
    },
    subStage: {
      fetch: Status.IDLE,
      update: Status.IDLE,
      create: Status.IDLE,
      delete: Status.IDLE,
    },
    task: {
      fetch: Status.IDLE,
      update: Status.IDLE,
      create: Status.IDLE,
    },
    subTask: {
      fetch: Status.IDLE,
      update: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const JobProcessSlice = createSlice({
  name: 'jobProcess',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchJobProcessFunctionality.pending, state => {
        state.status.fetchFunctionality = Status.PENDING;
      })
      .addCase(fetchJobProcessFunctionality.fulfilled, (state, action) => {
        state.jobProcessFunctionality = action.payload;
        state.status.fetchFunctionality = Status.SUCCESS;
      })
      .addCase(fetchJobProcessFunctionality.rejected, state => {
        state.status.fetchFunctionality = Status.ERROR;
      });

    // Stages
    builder
      .addCase(fetchJobProcessStages.pending, state => {
        state.status.stage.fetch = Status.PENDING;
      })
      .addCase(fetchJobProcessStages.fulfilled, (state, action) => {
        state.jobProcessStage = action.payload;
        state.status.stage.fetch = Status.SUCCESS;
      })
      .addCase(fetchJobProcessStages.rejected, state => {
        state.status.stage.fetch = Status.ERROR;
      });

    builder
      .addCase(createJobProcessStages.pending, state => {
        state.status.stage.create = Status.PENDING;
      })
      .addCase(createJobProcessStages.fulfilled, (state, action) => {
        state.jobProcessStage.unshift(action.payload);
        state.status.stage.create = Status.SUCCESS;
      })
      .addCase(createJobProcessStages.rejected, state => {
        state.status.stage.create = Status.ERROR;
      });

    builder
      .addCase(updateJobProcessStages.pending, state => {
        state.status.stage.update = Status.PENDING;
      })
      .addCase(updateJobProcessStages.fulfilled, (state, action) => {
        state.jobProcessStage = state.jobProcessStage.map(stage => {
          if (stage.stageId === action.payload.stageId) {
            return action.payload;
          }
          return stage;
        });
        state.status.stage.update = Status.SUCCESS;
      })
      .addCase(updateJobProcessStages.rejected, state => {
        state.status.stage.update = Status.ERROR;
      });

    builder
      .addCase(deleteJobProcessStage.pending, state => {
        state.status.stage.delete = Status.PENDING;
      })
      .addCase(deleteJobProcessStage.fulfilled, (state, action) => {
        state.jobProcessStage = state.jobProcessStage.filter(
          stage => stage.stageId !== action.payload
        );
        state.status.stage.delete = Status.SUCCESS;
      })
      .addCase(deleteJobProcessStage.rejected, state => {
        state.status.stage.delete = Status.ERROR;
      });

    // Sub Stage reducers
    builder
      .addCase(fetchJobProcessSubStages.pending, state => {
        state.status.subStage.fetch = Status.PENDING;
      })
      .addCase(fetchJobProcessSubStages.fulfilled, (state, action) => {
        state.jobProcessSubStage = action.payload;
        state.status.subStage.fetch = Status.SUCCESS;
      })
      .addCase(fetchJobProcessSubStages.rejected, state => {
        state.status.subStage.fetch = Status.ERROR;
      });

    builder
      .addCase(createJobProcessSubStages.pending, state => {
        state.status.subStage.create = Status.PENDING;
      })
      .addCase(createJobProcessSubStages.fulfilled, (state, action) => {
        state.jobProcessSubStage.unshift(action.payload);
        state.status.subStage.create = Status.SUCCESS;
      })
      .addCase(createJobProcessSubStages.rejected, state => {
        state.status.subStage.create = Status.ERROR;
      });

    builder
      .addCase(updateJobProcessSubStages.pending, state => {
        state.status.subStage.update = Status.PENDING;
      })
      .addCase(updateJobProcessSubStages.fulfilled, (state, action) => {
        state.jobProcessSubStage = state.jobProcessSubStage.map(stage => {
          if (stage.subStageId === action.payload.subStageId) {
            return action.payload;
          }
          return stage;
        });
        state.status.subStage.update = Status.SUCCESS;
      })
      .addCase(updateJobProcessSubStages.rejected, state => {
        state.status.subStage.update = Status.ERROR;
      });

    builder
      .addCase(deleteJobProcessSubStages.pending, state => {
        state.status.stage.delete = Status.PENDING;
      })
      .addCase(deleteJobProcessSubStages.fulfilled, (state, action) => {
        state.jobProcessSubStage = state.jobProcessSubStage.filter(
          stage => stage.subStageId !== action.payload
        );
        state.status.stage.delete = Status.SUCCESS;
      })
      .addCase(deleteJobProcessSubStages.rejected, state => {
        state.status.stage.delete = Status.ERROR;
      });
  },
});
export default JobProcessSlice.reducer;
