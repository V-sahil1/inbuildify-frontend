import { createSlice } from "@reduxjs/toolkit";
import { InitialContractorState } from "./IContractorState";
import { Status } from "@lib/constants/enum";
import {
  createServiceThunk,
  deleteServiceThunk,
  getServicesThunk,
  updateServiceThunk,
} from "./contractorThunk";

const initialState: InitialContractorState = {
  services: [],
  status: Status.IDLE,
};

export const contractorSlice = createSlice({
  name: "contractor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServicesThunk.pending, (state) => {
      state.status = Status.PENDING;
    });
    builder.addCase(getServicesThunk.fulfilled, (state, action) => {
      state.services = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getServicesThunk.rejected, (state) => {
      state.status = Status.ERROR;
    });

    builder.addCase(createServiceThunk.fulfilled, (state, action) => {
      state.services.unshift(action.payload);
    });
    builder.addCase(updateServiceThunk.fulfilled, (state, action) => {
      const index = state.services.findIndex(
        (service) => service.serviceId === action.payload.serviceId
      );
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    });
    builder.addCase(deleteServiceThunk.fulfilled, (state, action) => {
      state.services = state.services.filter(
        (service) => service.serviceId !== action.payload
      );
    });
  },
});

export default contractorSlice.reducer;
