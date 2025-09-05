import { createSlice,  } from "@reduxjs/toolkit";
import { createDwellingType, createFloorPlan, createRange, deleteDwellingType, deleteFloorPlan, deleteRange, fetchFloorPlans, getConditions, getFloorPlanFilters, updateDwellingType, updateFloorPlan, updateRange } from "./floorPlanThunk";
import { Status } from "@lib/constants/enum";
import { IFloorPlanState } from "./IFloorPlanState";


const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    floorPlans: [] as IFloorPlanState[],
    status: {floorPlan: Status.IDLE, filters: Status.IDLE, conditions: Status.IDLE},
    filters: null,
    selectedFilters: { range: '', dwelling_type: '' },
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFloorPlans.pending, (state) => {
        state.status.floorPlan = Status.PENDING;
      })
      .addCase(fetchFloorPlans.fulfilled, (state, action) => {
        state.floorPlans = action.payload.floorPlans;
        state.status.floorPlan = Status.SUCCESS;
      })
      .addCase(fetchFloorPlans.rejected, (state) => {
        state.status.floorPlan = Status.ERROR;
      })
      .addCase(getFloorPlanFilters.pending, state => {
        state.status.filters = Status.PENDING;
      })
      .addCase(getFloorPlanFilters.fulfilled, (state, action) => {
        state.status.filters = Status.SUCCESS;
        state.filters = action.payload;
      })
      .addCase(createFloorPlan.fulfilled, (state, action) => {
        state.floorPlans.unshift(action.payload);
      })
      .addCase(getConditions.fulfilled, (state, action) => {
        state.status.conditions = Status.SUCCESS;
        state.filters = {...state.filters, conditions: action.payload};
      })
      .addCase(updateFloorPlan.fulfilled, (state, action) => {
        state.floorPlans = state.floorPlans.map((floorPlan) =>
          floorPlan.floorPlanId === action.payload.floorPlanId ? action.payload : floorPlan
        );
      })
      .addCase(deleteFloorPlan.fulfilled, (state, action) => {
        state.floorPlans = state.floorPlans.filter(
          (floorPlan) => floorPlan.floorPlanId !== action.payload
        );
      })
      //range and dwelling type 
      .addCase(createRange.fulfilled, (state, action) => {
        state.filters.range.unshift(action.payload);
      })
      .addCase(createDwellingType.fulfilled, (state, action) => {
        state.filters.dwelling_type.unshift(action.payload);
      })
      .addCase(updateRange.fulfilled, (state, action) => {
        state.filters.range = state.filters.range.map((range) =>
          range.rangeId === action.payload.rangeId ? action.payload : range
        );
      })
      .addCase(updateDwellingType.fulfilled, (state, action) => {
        state.filters.dwelling_type = state.filters.dwelling_type.map((dwelling_type) =>
          dwelling_type.dwellingTypeId === action.payload.dwellingTypeId ? action.payload : dwelling_type
        );
      })
      .addCase(deleteRange.fulfilled, (state, action) => {
        state.filters.range = state.filters.range.filter(
          (range) => range.rangeId !== action.payload
        );
      })
      .addCase(deleteDwellingType.fulfilled, (state, action) => {
        state.filters.dwelling_type = state.filters.dwelling_type.filter(
          (dwelling_type) => dwelling_type.dwellingTypeId !== action.payload
        );
      })
  },
});

export const { setSelectedFilters } = floorPlanSlice.actions;
export default floorPlanSlice.reducer;
