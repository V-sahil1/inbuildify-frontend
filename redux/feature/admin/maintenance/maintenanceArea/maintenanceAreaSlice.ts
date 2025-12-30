import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IMaintenanceAreaState } from './IMaintenanceAreaState';
import {
  fetchMaintenanceArea,
  updateMaintenanceArea,
  createMaintenanceArea,
  deleteMaintenanceArea,
} from './maintenanceAreaThunk';

const initialState: IMaintenanceAreaState = {
  maintenanceArea: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const maintenanceAreaSlice = createSlice({
  name: 'maintenanceArea',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMaintenanceArea.pending, (state, action) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchMaintenanceArea.fulfilled, (state, action) => {
      state.maintenanceArea = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(createMaintenanceArea.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(createMaintenanceArea.fulfilled, (state, action) => {
      if (state.maintenanceArea) {
        state.maintenanceArea.unshift(action.payload);
      } else {
        state.maintenanceArea = [action.payload];
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(createMaintenanceArea.rejected, state => {
      state.status.update = Status.ERROR;
    });
    builder.addCase(updateMaintenanceArea.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateMaintenanceArea.fulfilled, (state, action) => {
      if (state.maintenanceArea) {
        const index = state.maintenanceArea.findIndex(
          item => item.maintenanceAreaId === action.payload.maintenanceAreaId
        );
        if (index !== -1) {
          state.maintenanceArea[index] = action.payload;
        }
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateMaintenanceArea.rejected, state => {
      state.status.update = Status.ERROR;
    });
    builder.addCase(deleteMaintenanceArea.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(deleteMaintenanceArea.fulfilled, (state, action) => {
      if (state.maintenanceArea) {
        state.maintenanceArea = state.maintenanceArea.filter(
          item => item.maintenanceAreaId !== action.payload
        );
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(deleteMaintenanceArea.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default maintenanceAreaSlice.reducer;
