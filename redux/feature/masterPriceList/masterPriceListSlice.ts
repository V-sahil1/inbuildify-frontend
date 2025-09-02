import { createSlice } from "@reduxjs/toolkit";
import {
  createCategoryItem,
  deleteCategoryItem,
  fetchCategories,
  fetchCategoryItems,
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
    setSelectedFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters(state) {
      state.selectedFilters = { range: "", dwelling_type: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch categories
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
          (c) => c.categoryId === action.payload.category_id
        );
        const updatedCategory = {
          categoryItemId: action.payload.category_item_id,
          builderId: action.payload.builder_id,
          categoryId: action.payload.category_id,
          description: action.payload.description,
          shortDescription: action.payload.short_description,
          costType: action.payload.cost_type,
          cost: action.payload.cost,
          costTypeText: action.payload.cost_type_text,
          costOption: action.payload.cost_option,
          includeByDefault: action.payload.include_by_default,
          showInHlPackage: action.payload.show_in_hl_package,
          packageOnly: action.payload.package_only,
          uom: action.payload.uom,
          sortOrder: action.payload.sort_order,
          status: action.payload.status,
          rangeName: action.payload.range_name,
          dwellingTypeName: action.payload.dwelling_type_name,
          createdAt: action.payload.created_at,
          updatedAt: action.payload.updated_at,
          conditions: action.payload.conditions,
        };
        if (category) {
          category.items = category.items?.map((item) =>
            item.categoryItemId === action.payload.category_item_id
              ? updatedCategory
              : item
          );
        }
      });
  },
});

export const { toggleExpand, setSelectedFilters, clearFilters } =
  masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
