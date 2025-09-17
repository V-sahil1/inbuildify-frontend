import { createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  createCategoryItem,
  deleteCategory,
  deleteCategoryItem,
  fetchCategories,
  fetchCategoryItems,
  updateCategory,
  updateCategoryItem,
} from "./masterPriceListThunk";
import { Status } from "@lib/constants/enum";
import { Category } from "./iMasterPriceListState";
const masterPriceListSlice = createSlice({
  name: "masterPriceList",
  initialState: {
    status: Status.IDLE,
    categories: [] as Category[],
    loading: false,
    selectedFilters: { range: "", dwelling_type: "" },
  },
  reducers: {
    toggleExpand(state, action) {
      const category = state.categories.find(
        (c) => c.categoryId === action.payload
      );
      if (category) {
        category.isExpanded = true;
      }
    },
    resetAllCategoriesIsExpanded(state) {
      state.categories.forEach(category => {
        category.isExpanded = false;
      });
    },
    setSelectedFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters(state) {
      state.selectedFilters = { range: "", dwelling_type: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      // categories
      .addCase(fetchCategories.pending, (state) => {
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
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push({
          ...action.payload,
          items: null,
          isExpanded: false,
          loadingItems: false,
        });
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const category = state.categories.find(
          (c) => c.categoryId === action.payload.categoryId
        );
        if (category) {
          category.name = action.payload.name;
          category.description = action.payload.description;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.categoryId !== action.payload.categoryId
        );
      })

      // fetch items
      .addCase(fetchCategoryItems.pending, (state, action) => {
        const category = state.categories.find(
          (c) => c.categoryId === action.meta.arg.categoryId
        );
        if (category) category.loadingItems = true;
      })
      .addCase(fetchCategoryItems.fulfilled, (state, action) => {
        const { categoryId, items } = action.payload;
        const category = state.categories.find(
          (c) => c.categoryId === categoryId
        );
        if (category) {
          category.items = items; // store only once
          category.loadingItems = false;
        }
      })

      // create item
      .addCase(createCategoryItem.fulfilled, (state, action) => {
        const category = state.categories.find(
          (c) => c.categoryId === action.meta.arg.category_id
        );
        if (category) {
          if (!category.items) {
            category.items = [];
          }
          category.items = [action.payload, ...(category.items || [])];
        }
      })

      //delete item
      .addCase(deleteCategoryItem.fulfilled, (state, action) => {
        const category = state.categories.find(c => c.categoryId === action.payload.categoryId);
        if (category) {
          category.items = category.items?.filter(item => item.categoryItemId !== action.payload.categoryItemId);
        }
      })

      //update item
      .addCase(updateCategoryItem.fulfilled, (state, action) => {
        const category = state.categories.find(
          (c) => c.categoryId === action.payload.categoryId
        );
        if (category) {
          category.items = category.items?.map((item) =>
            item.categoryItemId === action.payload.categoryItemId
              ? action.payload
              : item
          );
        }
      });
  },
});

export const { toggleExpand, setSelectedFilters, clearFilters, resetAllCategoriesIsExpanded } =
  masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
