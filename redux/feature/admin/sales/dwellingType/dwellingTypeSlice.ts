import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  updateDwellingStatus,
  updateDwellingType,
  fetchDwellingType,
  createDwellingType,
} from './dwellingTypeThunk';
import { IdwellingTypeState } from './IDwelingTypeState';

const initialState: IdwellingTypeState = {
  dwellingType: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const dwellingTypeSlice = createSlice({
  name: 'dwellingType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createDwellingType.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createDwellingType.fulfilled, (state, action) => {
      state.dwellingType.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createDwellingType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchDwellingType.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchDwellingType.fulfilled, (state, action) => {
      state.dwellingType = action.payload.dwellingType;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchDwellingType.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateDwellingType.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(updateDwellingType.fulfilled, (state, action) => {
      state.dwellingType = state.dwellingType.map(i =>
        i.dwellingTypeId === action.payload.dwellingTypeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateDwellingType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateDwellingStatus.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateDwellingStatus.fulfilled, (state, action) => {
      state.dwellingType = state.dwellingType.map(i =>
        i.dwellingTypeId === action.payload.dwellingTypeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateDwellingStatus.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default dwellingTypeSlice.reducer;
