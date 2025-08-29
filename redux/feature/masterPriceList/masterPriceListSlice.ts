import { createSlice,  } from "@reduxjs/toolkit";
import { createCategoryItem, fetchCategories, fetchCategoryItems } from "./masterPriceListThunk";
import { Status } from "@lib/constants/enum";
import { Category } from "./iMasterPriceListState";
const masterPriceListSlice = createSlice({
  name: "masterPriceList",
  initialState: {
    status: Status.IDLE,
    categories: [] as Category[],
    loading: false,
    selectedFilters: { range: '', dwelling_type: '' },
  },
  reducers: {
    toggleExpand(state, action) {
      const category = state.categories.find(c => c.categoryId === action.payload);
      if (category) {
        category.isExpanded = true;
      }
    },
    setSelectedFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters(state) {
      state.selectedFilters = { range: '', dwelling_type: '' };
    },
  },
  extraReducers: builder => {
    builder
      // fetch categories
      .addCase(fetchCategories.pending, state => {
        state.status = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.loading = false;
        state.categories = action.payload?.categories.map((c) => ({
          ...c,
          items: null,
          isExpanded: false,
          loadingItems: false,
        }));
      })

      // fetch items
      .addCase(fetchCategoryItems.pending, (state, action) => {
        const category = state.categories.find(c => c.categoryId === action.meta.arg.categoryId);
        if (category) category.loadingItems = true;
      })
      .addCase(fetchCategoryItems.fulfilled, (state, action) => {
        const { categoryId, items } = action.payload;
        const category = state.categories.find(c => c.categoryId === categoryId);
        if (category) {
          category.items = items;   // store only once
          category.loadingItems = false;
        }
      })

      // create item
      .addCase(createCategoryItem.fulfilled, (state, action) => {
        console.log(action.payload);
        const category = state.categories.find(c => c.categoryId === action.payload.categoryItemId);
        if (category) {
          if (!category.items) category.items = [];
          category.items = [...category?.items, action.payload];
        }
      })
  },
});

export const { toggleExpand, setSelectedFilters, clearFilters } = masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
