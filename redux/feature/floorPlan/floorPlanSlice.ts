import { createSlice } from '@reduxjs/toolkit';
import {
  createFloorPlan,
  deleteFloorPlan,
  fetchFloorPlans,
  getConditions,
  updateFloorPlan,
} from './floorPlanThunk';
import { Status } from '@lib/constants/enum';
import { IFloorPlanState } from './IFloorPlanState';
import { FloorplanPricelistRecord } from '@/components/table-columns/FloorplanPricelistColumns';

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState: {
    floorPlans: [] as IFloorPlanState[],
    status: { floorPlan: Status.IDLE, filters: Status.IDLE, conditions: Status.IDLE },
    filters: null,
    selectedFilters: { range: '', dwelling_type: '' },
    selectedFloorplans:[] as FloorplanPricelistRecord[]
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setSelectedFloorplans : (state,action) => {
      state.selectedFloorplans = [...state.selectedFloorplans,action.payload];
    },
    removeFloorplanItem : (state,action)=>{
      const {id}=action.payload
      state.selectedFloorplans = state.selectedFloorplans.filter((item) => item.id !== id)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFloorPlans.pending, state => {
        state.status.floorPlan = Status.PENDING;
      })
      .addCase(fetchFloorPlans.fulfilled, (state, action) => {
        state.floorPlans = action.payload.floorPlans;
        state.status.floorPlan = Status.SUCCESS;
      })
      .addCase(fetchFloorPlans.rejected, state => {
        state.status.floorPlan = Status.ERROR;
      })
      .addCase(createFloorPlan.fulfilled, (state, action) => {
        state.floorPlans.unshift(action.payload);
      })
      .addCase(getConditions.fulfilled, (state, action) => {
        state.status.conditions = Status.SUCCESS;
        state.filters = { ...state.filters, conditions: action.payload };
      })
      .addCase(updateFloorPlan.fulfilled, (state, action) => {
        state.floorPlans = state.floorPlans.map(floorPlan =>
          floorPlan.floorPlanId === action.payload.floorPlanId ? action.payload : floorPlan
        );
      })
      .addCase(deleteFloorPlan.fulfilled, (state, action) => {
        state.floorPlans = state.floorPlans.filter(
          floorPlan => floorPlan.floorPlanId !== action.payload
        );
      });
  },
});

export const { setSelectedFilters,setSelectedFloorplans,removeFloorplanItem } = floorPlanSlice.actions;
export default floorPlanSlice.reducer;
