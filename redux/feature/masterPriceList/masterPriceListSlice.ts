import { createSlice,  } from "@reduxjs/toolkit";
import { fetchCategories } from "./masterPriceListThunk";


const masterPriceListSlice = createSlice({
  name: "masterPriceList",
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {
    toggleExpand(state, action) {
      const category = state.categories.find(c => c.categoryId === action.payload);
      if (category) {
        category.isExpanded = !category.isExpanded;
      }
    },
  },
  extraReducers: builder => {
    builder
      // fetch categories
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories.map((c: any) => ({
          ...c,
          items: null,
          isExpanded: false,
          loadingItems: false,
        }));
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

export const { toggleExpand } = masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
