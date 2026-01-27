import { createSlice } from '@reduxjs/toolkit';
import { createFloorPlan, fetchFloorPlans, getConditions, updateFloorPlan } from './floorPlanThunk';
import { Status } from '@lib/constants/enum';
import { IFloorPlanState } from './IFloorPlanState';
import { FloorplanPricelistRecord } from '@/components/table-columns/FloorplanPricelistColumns';
import { CommonPagination } from '../common/ICommonState';

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState: {
    floorPlans: [] as IFloorPlanState[],
    status: {
      floorPlan: { fetch: Status.IDLE, create: Status.IDLE },
      filters: Status.IDLE,
      conditions: Status.IDLE,
    },
    filters: null,
    selectedFilters: { range: '', dwelling_type: '' },
    selectedFloorplans: [] as FloorplanPricelistRecord[],
    pagination: <CommonPagination>{},
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setSelectedFloorplans: (state, action) => {
      state.selectedFloorplans = [...state.selectedFloorplans, action.payload];
    },
    removeFloorplanItem: (state, action) => {
      const { id } = action.payload;
      state.selectedFloorplans = state.selectedFloorplans.filter(item => item.id !== id);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFloorPlans.pending, state => {
        state.status.floorPlan.fetch = Status.PENDING;
      })
      .addCase(fetchFloorPlans.fulfilled, (state, action) => {
        state.floorPlans = action.payload.floorPlans;
        state.pagination = action.payload.pagination;
        state.status.floorPlan.fetch = Status.SUCCESS;
      })
      .addCase(fetchFloorPlans.rejected, state => {
        state.status.floorPlan.fetch = Status.ERROR;
      })
      .addCase(createFloorPlan.pending, (state, action) => {
        state.floorPlans.unshift(action.payload);
        state.status.floorPlan.create = Status.PENDING;
      })
      .addCase(createFloorPlan.fulfilled, (state, action) => {
        state.floorPlans.unshift(action.payload);
        state.pagination.totalRecords++;
        state.status.floorPlan.create = Status.SUCCESS;
      })
      .addCase(getConditions.fulfilled, (state, action) => {
        state.status.conditions = Status.SUCCESS;
        state.filters = { ...state.filters, conditions: action.payload };
      })
      .addCase(updateFloorPlan.pending, (state, action) => {
        state.status.floorPlan.create = Status.PENDING;
      })
      .addCase(updateFloorPlan.fulfilled, (state, action) => {
        state.floorPlans = state.floorPlans.map(floorPlan =>
          floorPlan.floorPlanId === action.payload.floorPlanId ? action.payload : floorPlan
        );
        state.status.floorPlan.create = Status.SUCCESS;
      });
    // .addCase(deleteFloorPlan.fulfilled, (state, action) => {
    //   state.floorPlans = state.floorPlans.filter(
    //     floorPlan => floorPlan.floorPlanId !== action.payload
    //   );
    // });
  },
});

export const { setSelectedFilters, setSelectedFloorplans, removeFloorplanItem } =
  floorPlanSlice.actions;
export default floorPlanSlice.reducer;
