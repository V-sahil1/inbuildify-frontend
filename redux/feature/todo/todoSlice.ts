import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ITodoState } from './IToDoState';
import { fetchAllTodos, createTodo, updateTodo, deleteTodo } from './todoThunk';

const initialState: ITodoState = {
  todos: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
  counters: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllTodos.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllTodos.fulfilled, (state, action) => {
      state.todos = action.payload.todos;
      state.pagination = action.payload.pagination;
      state.counters = action.payload.counters ?? null;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllTodos.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(createTodo.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.unshift(action.payload);
      if (state.pagination) state.pagination.totalRecords++;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createTodo.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateTodo.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.todos = state.todos.map(t =>
        t.todoId === action.payload.todoId ? action.payload : t
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateTodo.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteTodo.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter(t => t.todoId !== action.meta.arg);
      if (state.pagination) state.pagination.totalRecords--;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteTodo.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});

export default todoSlice.reducer;
