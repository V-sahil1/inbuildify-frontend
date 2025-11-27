import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { TaskDetails } from 'data/types';

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task: [] as TaskDetails[],
    status: Status.IDLE,
  },
  reducers: {
    setTask: (state, action) => {
      state.task = [...state.task, action.payload];
    },
    updateTask: (state, action) => {
      const { id, value } = action.payload;
      state.task = state.task.map(i => (i.taskId === id ? value : i));
    },
  },
});

export const { setTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
