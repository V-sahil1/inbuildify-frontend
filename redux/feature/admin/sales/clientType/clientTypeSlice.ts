import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createClientType,
  deleteClientType,
  fetchAllClientType,
  updateClientType,
  updateClientTypeStatus,
} from './clientTypeThunk';
import { IClientTypeState } from './IClientTypeState';

const initialState: IClientTypeState = {
  clientType: [],
  status: {
    fetch: Status.IDLE,
  },
};

const clientTypeSlice = createSlice({
  name: 'clientType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createClientType.fulfilled, (state, action) => {
      state.clientType.unshift(action.payload);
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
    builder.addCase(updateClientType.fulfilled, (state, action) => {
      state.clientType = state.clientType.map(i =>
        i.clientTypeId === action.payload.clientTypeId ? action.payload : i
      );
    });
    builder.addCase(updateClientTypeStatus.fulfilled, (state, action) => {
      state.clientType = state.clientType.map(i =>
        i.clientTypeId === action.payload.clientTypeId ? action.payload : i
      );
    });
    builder.addCase(deleteClientType.fulfilled, (state, action) => {
      state.clientType = state.clientType.filter(i => i.clientTypeId !== action.payload);
    });
  },
});
export default clientTypeSlice.reducer;
