import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchRole } from './roleThunk';
import { IRoleState } from './IRoleState';

const initialState: IRoleState = {
  role: [],
  status: Status.IDLE,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchRole.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(fetchRole.fulfilled, (state, action) => {
      state.role = action.payload.role;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchRole.rejected, state => {
      state.status = Status.ERROR;
    });
  },
});

export default roleSlice.reducer;
