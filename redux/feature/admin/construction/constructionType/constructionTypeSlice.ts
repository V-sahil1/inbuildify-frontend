import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum'
import { ITypeState } from './IConstructionTypeState';
import { createType, deleteType, fetchAllType, updateType } from './constructionTypeThunk';

const initialState: ITypeState = {
  type: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const typeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createType.fulfilled, (state, action) => {
      state.type.unshift(action.payload);
    });
    builder.addCase(fetchAllType.fulfilled, (state, action) => {
      state.type = action.payload.constructionTypes;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateType.fulfilled, (state, action) => {
      state.type = state.type.map((i => i.constructionTypeId === action.payload.constructionTypeId ? action.payload : i))
    });
    builder.addCase(deleteType.fulfilled, (state, action) => {
      state.type = state.type.filter((i => i.constructionTypeId !== action.payload))
    });
  },
});
export default typeSlice.reducer;
