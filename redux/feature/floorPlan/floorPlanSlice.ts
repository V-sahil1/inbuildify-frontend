import { createSlice } from '@reduxjs/toolkit';
import {
  createFloorPlan,
  createFloorPlanFacade,
  createFloorPlanPricelist,
  deleteFloorPlanFacade,
  deleteFloorPlanPricelist,
  fetchFloorPlanFacade,
  fetchFloorPlanPricelist,
  fetchFloorPlans,
  getConditions,
  updateFloorPlan,
} from './floorPlanThunk';
import { Status } from '@lib/constants/enum';
import { FloorplanPricelist, IFloorPlanState } from './IFloorPlanState';
import { CommonPagination } from '../common/ICommonState';

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState: {
    floorPlans: [] as IFloorPlanState[],
    status: {
      floorPlan: { fetch: Status.IDLE, create: Status.IDLE },
      filters: Status.IDLE,
      conditions: Status.IDLE,
      floorPlanPricelist: { fetch: Status.IDLE, create: Status.IDLE },
    },
    filters: null,
    selectedFilters: { range: '', dwelling_type: '' },
    selectedFloorplans: [] as FloorplanPricelist[],
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
      .addCase(createFloorPlan.pending, (state) => {
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
          floorPlan.floorPlanId === action.payload.floorPlanId ? { ...floorPlan, ...action.payload } : floorPlan
        );
        state.status.floorPlan.create = Status.SUCCESS;
      })

      //floorplan pricelist
      .addCase(fetchFloorPlanPricelist.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.meta.arg);
        if (floorplan) {
          floorplan.pricelistItems = action.payload.mappings;
        }
        state.status.floorPlanPricelist.fetch = Status.SUCCESS;
      })
      .addCase(createFloorPlanPricelist.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.payload.floorPlanId);
        if (floorplan) {
          floorplan.pricelistItems.push(action.payload);
        }
        state.status.floorPlanPricelist.create = Status.SUCCESS;
      })
      .addCase(deleteFloorPlanPricelist.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.payload.floorPlanId);
        if (floorplan) {
          floorplan.pricelistItems = floorplan.pricelistItems.filter(
            i => i.id !== action.payload.id
          );
        }
        state.status.floorPlanPricelist.create = Status.SUCCESS;
      })

      //floorplan facade
      .addCase(fetchFloorPlanFacade.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.meta.arg);
        if (floorplan) {
          floorplan.facade = action.payload.mappings;
        }
      })
      .addCase(createFloorPlanFacade.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.payload.floorPlanId);
        if (floorplan) {
          floorplan.facade.push(action.payload);
        }
      })
      .addCase(deleteFloorPlanFacade.fulfilled, (state, action) => {
        const floorplan = state.floorPlans.find(i => i.floorPlanId === action.payload.floorPlanId);
        if (floorplan) {
          floorplan.facade = floorplan.facade.filter(i => i.id !== action.payload.id);
        }
      });
  },
});

export const { setSelectedFilters, setSelectedFloorplans, removeFloorplanItem } =
  floorPlanSlice.actions;
export default floorPlanSlice.reducer;
