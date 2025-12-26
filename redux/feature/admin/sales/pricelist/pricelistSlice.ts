import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IPricelistState } from './IPricelistState';
import { fetchPricelist } from './pricelistThunk';

const initialState: IPricelistState = {
  pricelist: [],
  status: Status.IDLE,
};

const pricelistSlice = createSlice({
  name: 'pricelist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPricelist.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(fetchPricelist.fulfilled, (state, action) => {
      state.pricelist = action.payload.data;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchPricelist.rejected, state => {
      state.status = Status.ERROR;
    });
  },
});

export default pricelistSlice.reducer;
