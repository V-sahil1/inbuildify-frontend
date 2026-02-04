import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import {
  fetchJobInvoiceSetting,
  fetchJobInvoiceStage,
  updateJobInvoiceSetting,
  createJobInvoiceStage,
  updateJobInvoiceStage,
  deleteJobInvoiceStage,
} from './jobInvoiceThunk';
import { IJobInvoiceState } from './IJobInvoiceState';

const initialState: IJobInvoiceState = {
  jobInvoiceSetting: null,
  jobInvoiceStage: [],
  InvoiceStageStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  pagination: null,
};

const JobInvoiceSlice = createSlice({
  name: 'jobInvoice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchJobInvoiceSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobInvoiceSetting.fulfilled, (state, action) => {
      state.jobInvoiceSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobInvoiceSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateJobInvoiceSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateJobInvoiceSetting.fulfilled, (state, action) => {
      state.jobInvoiceSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateJobInvoiceSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });

    builder.addCase(fetchJobInvoiceStage.pending, state => {
      state.InvoiceStageStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchJobInvoiceStage.fulfilled, (state, action) => {
      state.jobInvoiceStage = action.payload.jobInvoiceStagePayments;
      state.pagination = action.payload.pagination;
      state.InvoiceStageStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchJobInvoiceStage.rejected, state => {
      state.InvoiceStageStatus.fetch = Status.ERROR;
    });

    builder.addCase(createJobInvoiceStage.pending, state => {
      state.InvoiceStageStatus.update = Status.PENDING;
    });
    builder.addCase(createJobInvoiceStage.fulfilled, (state, action) => {
      state.jobInvoiceStage.push(action.payload);
      state.pagination.totalRecords++;
      state.InvoiceStageStatus.update = Status.SUCCESS;
    });
    builder.addCase(createJobInvoiceStage.rejected, state => {
      state.InvoiceStageStatus.update = Status.ERROR;
    });

    builder.addCase(updateJobInvoiceStage.pending, state => {
      state.InvoiceStageStatus.update = Status.PENDING;
    });
    builder.addCase(updateJobInvoiceStage.fulfilled, (state, action) => {
      const index = state.jobInvoiceStage.findIndex(
        item => item.jobInvoiceStagePaymentId === action.payload.jobInvoiceStagePaymentId
      );
      if (index !== -1) {
        state.jobInvoiceStage[index] = action.payload;
      }
      state.InvoiceStageStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateJobInvoiceStage.rejected, state => {
      state.InvoiceStageStatus.update = Status.ERROR;
    });

    builder.addCase(deleteJobInvoiceStage.pending, state => {
      state.InvoiceStageStatus.update = Status.PENDING;
    });
    builder.addCase(deleteJobInvoiceStage.fulfilled, (state, action) => {
      const index = state.jobInvoiceStage.findIndex(
        item => item.jobInvoiceStagePaymentId === action.payload.jobInvoiceStagePaymentId
      );
      if (index !== -1) {
        state.jobInvoiceStage.splice(index, 1);
      }
      state.pagination.totalRecords--;
      state.InvoiceStageStatus.update = Status.SUCCESS;
    });
    builder.addCase(deleteJobInvoiceStage.rejected, state => {
      state.InvoiceStageStatus.update = Status.ERROR;
    });
  },
});
export default JobInvoiceSlice.reducer;
