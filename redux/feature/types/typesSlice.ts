import { Status } from "@lib/constants/enum";
import { createSlice } from "@reduxjs/toolkit";
import { DwellingType, Range } from "./ITypesState";
import {
  createDwellingType,
  createRange,
  deleteDwellingType,
  deleteRange,
  getDwellingTypes,
  getRanges,
  updateDwellingType,
  updateRange,
} from "./typesThunk";

type TypesState = {
  range: Range[] | null;
  dwellingType: DwellingType[] | null;
  status: {range: Status, dwellingType: Status};
  error: {range: string, dwellingType: string};
};

const initialState: TypesState = {
  range: null,
  dwellingType: null,
  status: {range: Status.IDLE, dwellingType: Status.IDLE},
  error: {range: '', dwellingType: ''},
};

const typesSlice = createSlice({
  name: "types",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //range
      .addCase(getRanges.pending, (state, action) => {
        state.status.range = Status.PENDING;
      })
      .addCase(getRanges.fulfilled, (state, action) => {
        state.status.range = Status.SUCCESS;
        state.range = action.payload;
      })
      .addCase(getRanges.rejected, (state, action) => {
        state.status.range = Status.ERROR;
      })
      .addCase(createRange.fulfilled, (state, action) => {
        state.range.unshift(action.payload);
      })
      .addCase(updateRange.fulfilled, (state, action) => {
        state.range = state.range.map((range) =>
          range.rangeId === action.payload.rangeId ? action.payload : range
        );
      })
      .addCase(deleteRange.fulfilled, (state, action) => {
        state.range = state.range.filter(
          (range) => range.rangeId !== action.payload
        );
      })

      //dwelling type
      .addCase(getDwellingTypes.pending, (state, action) => {
        state.status.dwellingType = Status.PENDING;
      })
      .addCase(getDwellingTypes.fulfilled, (state, action) => {
        state.status.dwellingType = Status.SUCCESS;
        state.dwellingType = action.payload;
      })
      .addCase(getDwellingTypes.rejected, (state, action) => {
        state.status.dwellingType = Status.ERROR;
      })
      .addCase(createDwellingType.fulfilled, (state, action) => {
        state.dwellingType.unshift(action.payload);
      })
      
      .addCase(updateDwellingType.fulfilled, (state, action) => {
        state.dwellingType = state.dwellingType.map((dwelling_type) =>
          dwelling_type.dwellingTypeId === action.payload.dwellingTypeId
            ? action.payload
            : dwelling_type
        );
      })
      .addCase(deleteDwellingType.fulfilled, (state, action) => {
        state.dwellingType = state.dwellingType.filter(
          (dwelling_type) => dwelling_type.dwellingTypeId !== action.payload
        );
      });
  },
});

export default typesSlice.reducer;
