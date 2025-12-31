import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchJobColor, updateJobColor } from './jobColorThunk';
import { IJobColorState } from './IJobColorState';

const initialState: IJobColorState = {
  jobColor: null,
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const JobColorSlice = createSlice({
  name: 'jobColor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobColor.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobColor.fulfilled, (state, action) => {
      state.jobColor = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobColor.rejected, (state, action) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobColor.pending, (state, action) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobColor.fulfilled, (state, action) => {
      state.jobColor = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobColor.rejected, (state, action) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default JobColorSlice.reducer;
