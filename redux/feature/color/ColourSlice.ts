import { createSlice } from "@reduxjs/toolkit";

import { Status } from "@lib/constants/enum";
import {
  createColourCategory,
  createColourSubCategory,
  createColourSubCategoryItem,
  deleteColourCategory,
  deleteColourSubCategory,
  deleteColourSubCategoryItem,
  fetchColourCategory,
  fetchColourSubCategory,
  fetchColourSubCategoryItems,
  updateColourCategory,
  updateColourSubCategory,
  updateColourSubCategoryItem,
} from "./colorThunk";
import {
  ColorInitialState,
  SubCategory,
} from "./iColourState";

const initialState: ColorInitialState = {
  status: Status.IDLE,
  ColorCategory: [],
  loading: false,
};
const ColourSlice = createSlice({
  name: "Colour",
  initialState,
  reducers: {
    toggleExpandColourCategory(state, action) {
      const colorCategory = state.ColorCategory.find(
        (c) => c.colorCategoryId === action.payload
      );
      if (colorCategory) {
        colorCategory.isExpanded = true;
      }
    },
    toggleExpandColourCategoryItem(state, action) {
      const { colorCategoryId, colorSubCategoryId } = action.payload;

      const colorCategory = state.ColorCategory.find(
        (c) => c.colorCategoryId === colorCategoryId
      );

      if (colorCategory) {
        const subCategory = colorCategory.subCategories.find(
          (sc) => sc.colorSubCategoryId === colorSubCategoryId
        );

        if (subCategory && !subCategory.isExpanded) {
          subCategory.isExpanded = true;
        }
      }
    },

    resetAllCategoriesIsExpanded(state) {
      state.ColorCategory.forEach((category) => {
        category.isExpanded = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // color category
      .addCase(fetchColourCategory.pending, (state) => {
        state.status = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchColourCategory.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.loading = false;
        state.ColorCategory = action.payload?.colorCategories?.map((c) => ({
          ...c,
          subCategories: [],
          isExpanded: false,
        }));
      })
      .addCase(createColourCategory.fulfilled, (state, action) => {
        state.ColorCategory.unshift({
          ...action.payload,
          subCategories: [],
          isExpanded: false,
        });
      })
      .addCase(updateColourCategory.fulfilled, (state, action) => {
        const category = state.ColorCategory.find(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );
        if (category) {
          category.name = action.payload.name;
          category.description = action.payload.description;
        }
      })
      .addCase(deleteColourCategory.fulfilled, (state, action) => {
        state.ColorCategory = state.ColorCategory.filter(
          (c) => c.colorCategoryId !== action.payload.colorCategoryId
        );
      });

    // color subcategory
    builder
      .addCase(fetchColourSubCategory.pending, (state) => {
        state.status = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchColourSubCategory.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.loading = false;
      
        const category = state.ColorCategory.find(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );
      
        if (category) {
          const existingSubCategories = category.subCategories || []; 
          const fetchedSubCategories = action.payload.data.colorSubCategories.map((c) => ({
            ...c,
            items: [],
            isExpanded: false,
          })); 
          const merged = [
            ...existingSubCategories,
            ...fetchedSubCategories.filter(
              (fetched) =>
                !existingSubCategories.some(
                  (existing) => existing.colorSubCategoryId === fetched.colorSubCategoryId
                )
            ),
          ];
      
          category.subCategories = merged;
        }
      })
      .addCase(createColourSubCategory.fulfilled, (state, action) => {
        const category = state.ColorCategory.find(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );
        category?.subCategories.unshift({
          ...action.payload,
          items: [],
          isExpanded: false,
        });
      })
      .addCase(updateColourSubCategory.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );

        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories.map(
              (c: SubCategory) =>
                c.colorSubCategoryId === action.payload.colorSubCategoryId
                  ? {
                      ...c,
                      name: action.payload.name,
                      description: action.payload.description,
                    }
                  : c
            );
        }
      })
      .addCase(deleteColourSubCategory.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );
        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories.filter(
              (c: SubCategory) =>
                c.colorSubCategoryId !== action.payload.colorSubCategoryId
            );
        }
      })

      // color subcategory items
      .addCase(fetchColourSubCategoryItems.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex(
          (c) => c.colorCategoryId === action.payload.colorCategoryId
        );
      
        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories?.map((sub: SubCategory) => {
              if (sub.colorSubCategoryId === action.payload.colorSubCategoryId) { 
                const existingItemIds = new Set(sub.items.map((i) => i.colorItemId)); 
                const newItems = action.payload.data.colorItems.filter(
                  (i) => !existingItemIds.has(i.colorItemId)
                );
      
                return {
                  ...sub,
                  items: sub.items.length > 0 ? [...sub.items, ...newItems] : [...newItems],
                };
              }
              return sub;
            }) || null;
        }
      })
      
      .addCase(createColourSubCategoryItem.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex((c) =>
          c.subCategories?.some(
            (sub: SubCategory) =>
              sub.colorSubCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories.map(
              (subCategory: SubCategory) =>
                subCategory.colorSubCategoryId ===
                action.payload.colorSubCategoryId
                  ? {
                      ...subCategory,
                      items: [...(subCategory.items || []), action.payload],
                    }
                  : subCategory
            );
        }
      })
      .addCase(updateColourSubCategoryItem.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex((c) =>
          c.subCategories?.some(
            (sub: SubCategory) =>
              sub.colorSubCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories.map(
              (subCategory: SubCategory) =>
                subCategory.colorSubCategoryId ===
                action.payload.colorSubCategoryId
                  ? {
                      ...subCategory,
                      items:
                        subCategory.items?.map((item) =>
                          item.colorItemId === action.payload.colorItemId
                            ? action.payload
                            : item
                        ) || [],
                    }
                  : subCategory
            );
        }
      })
      .addCase(deleteColourSubCategoryItem.fulfilled, (state, action) => {
        const categoryIndex = state.ColorCategory.findIndex((c) =>
          c.subCategories?.some(
            (sub: SubCategory) =>
              sub.colorSubCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.ColorCategory[categoryIndex].subCategories =
            state.ColorCategory[categoryIndex].subCategories.map(
              (subCategory: SubCategory) =>
                subCategory.colorSubCategoryId ===
                action.payload.colorSubCategoryId
                  ? {
                      ...subCategory,
                      items:
                        subCategory.items?.filter(
                          (item) =>
                            item.colorItemId !== action.payload.colorItemId
                        ) || [],
                    }
                  : subCategory
            );
        }
      });
  },
});

export const { toggleExpandColourCategory, toggleExpandColourCategoryItem } =
  ColourSlice.actions;
export default ColourSlice.reducer;
