import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createClientType,
  fetchAllClientType,
  updateClientType,
  updateClientTypeStatus,
} from './clientTypeThunk';
import { IClientTypeState } from './IClientTypeState';

const initialState: IClientTypeState = {
  clientType: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const clientTypeSlice = createSlice({
  name: 'clientType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createClientType.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createClientType.fulfilled, (state, action) => {
      state.clientType.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createClientType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllClientType.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllClientType.fulfilled, (state, action) => {
      state.clientType = action.payload.clientType;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllClientType.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateClientType.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(updateClientType.fulfilled, (state, action) => {
      state.clientType = state.clientType.map(i =>
        i.clientTypeId === action.payload.clientTypeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateClientType.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(updateClientTypeStatus.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateClientTypeStatus.fulfilled, (state, action) => {
      state.clientType = state.clientType.map(i =>
        i.clientTypeId === action.payload.clientTypeId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateClientTypeStatus.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export default clientTypeSlice.reducer;
