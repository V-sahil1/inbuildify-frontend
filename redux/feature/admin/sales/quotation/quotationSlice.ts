import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchQuotationSetting, updateQuotationSetting } from './quotationThunk';
import { IQuotationSettingState, quotationSetting } from './IQuotationState';

const initialState: IQuotationSettingState = {
  quotationSetting: <quotationSetting>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const quotationSettingSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchQuotationSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchQuotationSetting.fulfilled, (state, action) => {
      state.quotationSetting = action.payload.quotationSettings;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchQuotationSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateQuotationSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateQuotationSetting.fulfilled, (state, action) => {
      state.quotationSetting = { ...state.quotationSetting, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateQuotationSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default quotationSettingSlice.reducer;
