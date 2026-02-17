import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ITaskState } from './ITaskStates';
import { createTask, deleteTask, fetchAllTask, updateTask } from './taskThunk';

const initialState: ITaskState = {
  tasks: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createTask.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.unshift(action.payload);
      state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createTask.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllTask.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllTask.fulfilled, (state, action) => {
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllTask.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateTask.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.status.create = Status.SUCCESS;
      state.tasks = state.tasks.map(i => (i.taskId === action.payload.taskId ? action.payload : i));
    });
    builder.addCase(updateTask.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteTask.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(task => task.taskId !== action.meta.arg);
      state.pagination.totalRecords--;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteTask.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});

export default taskSlice.reducer;
