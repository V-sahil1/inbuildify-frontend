import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchJobColor } from './jobColorThunk';
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
  },
});
export default JobColorSlice.reducer;
