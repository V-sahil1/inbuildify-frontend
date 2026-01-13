import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IDriveState } from './IDriveState';
import { fetchDrive } from './driveThunk';

const initialState: IDriveState = {
  drives: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDrive.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchDrive.fulfilled, (state, action) => {
      state.drives = action.payload.drives;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchDrive.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
  },
});
export default driveSlice.reducer;
