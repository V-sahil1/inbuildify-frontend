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
  fetchJobPredecessorTask,
  fetchJobProcessSubStageTasks,
  createJobProcessTasks,
  updateJobProcessTasks,
  deleteJobProcessTasks,
  createJobProcessSubTasks,
  updateJobProcessSubTasks,
  deleteJobProcessSubTasks,
  fetchAllJobProcessSubStageTasks,
} from './jobProcessThunk';
import { IJobSettingState } from './IJobProcessState';

const initialState: IJobSettingState = {
  jobProcessFunctionality: [],
  jobPredecessorTask: [],
  jobProcessStage: [],
  jobProcessSubStage: [],
  jobProcessTask: [],
  jobProcessSubTask: [],
  jobProcessAllTask: [],
  status: {
    fetchFunctionality: Status.IDLE,
    fetchbPredecessorTask: Status.IDLE,
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
      delete: Status.IDLE,
    },
    subTask: {
      update: Status.IDLE,
      create: Status.IDLE,
      delete: Status.IDLE,
    },
  },
};

const JobProcessSlice = createSlice({
  name: 'jobProcess',
  initialState,
  reducers: {
    updateJobStageList: (state, action) => {
      state.jobProcessStage = action.payload;
    },
  },
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

    builder
      .addCase(fetchJobPredecessorTask.pending, state => {
        state.status.fetchbPredecessorTask = Status.PENDING;
      })
      .addCase(fetchJobPredecessorTask.fulfilled, (state, action) => {
        state.jobPredecessorTask = action.payload;
        state.status.fetchbPredecessorTask = Status.SUCCESS;
      })
      .addCase(fetchJobPredecessorTask.rejected, state => {
        state.status.fetchbPredecessorTask = Status.ERROR;
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
        state.jobProcessSubStage.push(action.payload);
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

    // Task

    builder
      .addCase(fetchAllJobProcessSubStageTasks.pending, state => {
        state.status.task.fetch = Status.PENDING;
      })
      .addCase(fetchAllJobProcessSubStageTasks.fulfilled, (state, action) => {
        state.jobProcessAllTask = action.payload;
        state.status.task.fetch = Status.SUCCESS;
      })
      .addCase(fetchAllJobProcessSubStageTasks.rejected, state => {
        state.status.task.fetch = Status.ERROR;
      });

    builder
      .addCase(fetchJobProcessSubStageTasks.pending, state => {
        state.status.task.fetch = Status.PENDING;
      })
      .addCase(fetchJobProcessSubStageTasks.fulfilled, (state, action) => {
        state.jobProcessTask = action.payload;
        state.status.task.fetch = Status.SUCCESS;
      })
      .addCase(fetchJobProcessSubStageTasks.rejected, state => {
        state.status.task.fetch = Status.ERROR;
      });

    builder
      .addCase(createJobProcessTasks.pending, state => {
        state.status.task.create = Status.PENDING;
      })
      .addCase(createJobProcessTasks.fulfilled, (state, action) => {
        state.jobProcessTask.push(action.payload);
        state.jobProcessAllTask.push(action.payload);
        state.status.task.create = Status.SUCCESS;
      })
      .addCase(createJobProcessTasks.rejected, state => {
        state.status.task.create = Status.ERROR;
      });

    builder
      .addCase(updateJobProcessTasks.pending, state => {
        state.status.task.update = Status.PENDING;
      })
      .addCase(updateJobProcessTasks.fulfilled, (state, action) => {
        state.jobProcessTask = state.jobProcessTask.map(task => {
          if (task.jobProcessTaskId === action.payload.jobProcessTaskId) {
            return { ...task, ...action.payload };
          }
          return task;
        });
        state.status.task.update = Status.SUCCESS;
      })
      .addCase(updateJobProcessTasks.rejected, state => {
        state.status.task.update = Status.ERROR;
      });

    builder
      .addCase(deleteJobProcessTasks.pending, state => {
        state.status.task.delete = Status.PENDING;
      })
      .addCase(deleteJobProcessTasks.fulfilled, (state, action) => {
        state.jobProcessTask = state.jobProcessTask.filter(
          task => task.jobProcessTaskId !== action.payload
        );
        state.jobProcessAllTask = state.jobProcessAllTask.filter(
          i => i.jobProcessTaskId !== action.payload
        );
        state.status.task.delete = Status.SUCCESS;
      })
      .addCase(deleteJobProcessTasks.rejected, state => {
        state.status.task.delete = Status.ERROR;
      });

    // Sub-Task
    builder
      .addCase(createJobProcessSubTasks.pending, state => {
        state.status.subTask.create = Status.PENDING;
      })
      .addCase(createJobProcessSubTasks.fulfilled, (state, action) => {
        // Find the parent task and add the sub-task to it
        const parentTask = state.jobProcessTask.find(
          task => task.jobProcessTaskId === action.meta.arg.taskId
        );
        if (parentTask) {
          if (!parentTask.subTasks) {
            parentTask.subTasks = [];
          }
          parentTask.subTasks.push({
            ...action.payload,
            subTaskId: action.payload.jobProcessSubtaskId,
          });
        }
        state.status.subTask.create = Status.SUCCESS;
      })
      .addCase(createJobProcessSubTasks.rejected, state => {
        state.status.subTask.create = Status.ERROR;
      });

    builder
      .addCase(updateJobProcessSubTasks.pending, state => {
        state.status.subTask.update = Status.PENDING;
      })
      .addCase(updateJobProcessSubTasks.fulfilled, (state, action) => {
        // Find the parent task and update the sub-task within it
        const parentTask = state.jobProcessTask.find(
          task => task.jobProcessTaskId === action.payload.jobProcessTask.id
        );
        if (parentTask && parentTask.subTasks) {
          const subTaskIndex = parentTask.subTasks.findIndex(
            subTask => subTask.subTaskId === action.payload.jobProcessSubtaskId
          );
          if (subTaskIndex !== -1) {
            parentTask.subTasks[subTaskIndex] = {
              ...parentTask.subTasks[subTaskIndex],
              ...action.payload,
            };
          }
        }
        state.status.subTask.update = Status.SUCCESS;
      })
      .addCase(updateJobProcessSubTasks.rejected, state => {
        state.status.subTask.update = Status.ERROR;
      });

    builder
      .addCase(deleteJobProcessSubTasks.pending, state => {
        state.status.subTask.delete = Status.PENDING;
      })
      .addCase(deleteJobProcessSubTasks.fulfilled, (state, action) => {
        // Find the parent task and remove the sub-task from it
        const parentTask = state.jobProcessTask.find(
          task => task.jobProcessTaskId === action.payload.taskId
        );
        if (parentTask && parentTask.subTasks) {
          parentTask.subTasks = parentTask.subTasks.filter(
            subTask => subTask.subTaskId !== action.payload.subTaskId
          );
        }
        state.status.subTask.delete = Status.SUCCESS;
      })
      .addCase(deleteJobProcessSubTasks.rejected, state => {
        state.status.subTask.delete = Status.ERROR;
      });
  },
});
export const { updateJobStageList } = JobProcessSlice.actions;

export default JobProcessSlice.reducer;
