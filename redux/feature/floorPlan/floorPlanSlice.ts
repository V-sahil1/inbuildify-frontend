import { createSlice,  } from "@reduxjs/toolkit";
import { createFloorPlan, fetchFloorPlans, getFloorPlanFilters } from "./floorPlanThunk";
import { Status } from "@lib/constants/enum";


const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    floorPlans: [],
    status: Status.IDLE,
    filters: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetch categories
      .addCase(fetchFloorPlans.pending, state => {
        state.status = Status.PENDING;
      })
      .addCase(fetchFloorPlans.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.floorPlans = action.payload.floorPlans;
      })
   
      .addCase(getFloorPlanFilters.pending, state => {
        state.status = Status.PENDING;
      })
      .addCase(getFloorPlanFilters.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.filters = action.payload;
      })
      .addCase(createFloorPlan.fulfilled, (state, action) => {
        state.floorPlans.push(action.payload);
      })
    
      // fetch items
    //   .addCase(fetchCategoryItems.pending, (state, action) => {
    //     const category = state.categories.find(c => c.id === action.meta.arg);
    //     if (category) category.loadingItems = true;
    //   })
    //   .addCase(fetchCategoryItems.fulfilled, (state, action) => {
    //     const { categoryId, items } = action.payload;
    //     const category = state.categories.find(c => c.id === categoryId);
    //     if (category) {
    //       category.items = items;   // store only once
    //       category.loadingItems = false;
    //     }
    //   });
  },
});

export const {  } = floorPlanSlice.actions;
export default floorPlanSlice.reducer;
