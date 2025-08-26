import { createSlice,  } from "@reduxjs/toolkit";
import { createFloorPlan, fetchFloorPlans, getFloorPlanFilters } from "./floorPlanThunk";


const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    floorPlans: [],
    loading: false,
    filters: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetch categories
      .addCase(fetchFloorPlans.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFloorPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.floorPlans = action.payload.floorPlans;
      })
   
      .addCase(getFloorPlanFilters.pending, state => {
        state.loading = true;
      })
      .addCase(getFloorPlanFilters.fulfilled, (state, action) => {
        state.loading = false;
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
