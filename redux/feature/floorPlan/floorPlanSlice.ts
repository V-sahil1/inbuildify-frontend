import { createSlice,  } from "@reduxjs/toolkit";
import { createFloorPlan, fetchFloorPlans, getConditions, getFloorPlanFilters } from "./floorPlanThunk";
import { Status } from "@lib/constants/enum";
import { IFloorPlanState } from "./IFloorPlanState";


const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    floorPlans: [] as IFloorPlanState[],
    status: {floorPlan: Status.IDLE, filters: Status.IDLE, conditions: Status.IDLE},
    filters: null,
  },
  reducers: {},
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
        state.floorPlans.push(action.payload);
      })
      .addCase(getConditions.fulfilled, (state, action) => {
        state.status.conditions = Status.SUCCESS;
        state.filters = {...state.filters, conditions: action.payload};
      })
  },
});

export const {  } = floorPlanSlice.actions;
export default floorPlanSlice.reducer;
