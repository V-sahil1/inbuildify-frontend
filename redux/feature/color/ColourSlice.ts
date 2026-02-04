import { createSlice, current } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import {
  createColourCategory,
  createColourGroup,
  createColourSubCategory,
  createColourSubCategoryItem,
  deleteColourCategory,
  deleteColourGroup,
  deleteColourSubCategory,
  deleteColourSubCategoryItem,
  fetchColourCategory,
  fetchColourGroups,
  fetchColourSubCategory,
  fetchColourSubCategoryItems,
  updateColourCategory,
  updateColourGroup,
  updateColourSubCategory,
  updateColourSubCategoryItem,
} from './colorThunk';
import { ColorInitialState, Category } from './iColourState';

const initialState: ColorInitialState = {
  status: Status.IDLE,
  Color: [],
  ColorGroup: [],
  loading: false,
};
const ColourSlice = createSlice({
  name: 'Colour',
  initialState,
  reducers: {
    toggleExpandColourCategory(state, action) {
      const colorCategory = state.Color.find(c => c.colorId === action.payload);
      if (colorCategory) {
        colorCategory.isExpanded = true;
      }
    },
    toggleExpandColourCategoryItem(state, action) {
      const { colorCategoryId, colorSubCategoryId } = action.payload;

      const colorCategory = state.Color.find(c => c.colorId === colorCategoryId);

      if (colorCategory) {
        const subCategory = colorCategory.colorCategories.find(
          sc => sc.colorCategoryId === colorSubCategoryId
        );

        if (subCategory && !subCategory.isExpanded) {
          subCategory.isExpanded = true;
        }
      }
    },

    resetAllCategoriesIsExpanded(state) {
      state.Color.forEach(category => {
        category.isExpanded = false;
      });
    },
  },
  extraReducers: builder => {
    builder
      // color category
      .addCase(fetchColourCategory.pending, state => {
        state.status = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchColourCategory.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.loading = false;
        state.Color = action.payload?.colors?.map(c => ({
          ...c,
          subCategories: [],
          isExpanded: false,
        }));
      })
      .addCase(fetchColourCategory.rejected, (state) => {
        state.status = Status.ERROR;
        state.loading = false;
      })
      .addCase(createColourCategory.fulfilled, (state, action) => {
        state.Color.unshift({
          ...action.payload,
          // categories: [],
          isExpanded: false,
        });
      })
      .addCase(updateColourCategory.fulfilled, (state, action) => {
        const category = state.Color.find(
          c => c.colorId === action.payload.colorId
        );
        if (category) {
          category.colorName = action.payload.colorName;
        }
      })
      .addCase(deleteColourCategory.fulfilled, (state, action) => {
        state.Color = state.Color.filter(
          c => c.colorId !== action.payload.colorId
        );
      });

    // color subcategory
    builder
      .addCase(fetchColourSubCategory.pending, state => {
        state.loading = true;
      })
      .addCase(fetchColourSubCategory.fulfilled, (state, action) => {
        state.loading = false;

        const category = state.Color.find(
          c => c.colorId === action.payload.colorId
        );
        if (category) {
          const existingSubCategories = category.colorCategories || [];
          const fetchedSubCategories = action.payload.data.map(c => ({
            ...c,
            items: [],
            isExpanded: false,
          }));

          const merged = [
            ...existingSubCategories,
            ...fetchedSubCategories.filter(
              fetched =>
                !existingSubCategories.some(
                  existing => existing.colorCategoryId === fetched.colorCategoryId
                )
            ),
          ];

          category.colorCategories = merged;
        }
      })
      .addCase(createColourSubCategory.fulfilled, (state, action) => {
        const category = state.Color.find(
          c => c.colorId === action.payload.colorId
        );
        category?.colorCategories.unshift({
          ...action.payload,
          items: [],
          isExpanded: false,
        });
      })
      .addCase(updateColourSubCategory.fulfilled, (state, action) => {
        const categoryIndex = state.Color.findIndex(
          c => c.colorId === action.payload.colorId
        );

        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories = state.Color[
            categoryIndex
          ].colorCategories.map((c: Category) =>
            c.colorCategoryId === action.payload.colorCategoryId
              ? {
                  ...c,
                  categoryName: action.payload.categoryName,
                }
              : c
          );
        }
      })
      .addCase(deleteColourSubCategory.fulfilled, (state, action) => {
        const categoryIndex = state.Color.findIndex(
          c => c.colorId === action.payload.colorId
        );
        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories = state.Color[
            categoryIndex
          ].colorCategories.filter(
            (c: Category) => c.colorCategoryId !== action.payload.colorCategoryId
          );
        }
      })

      // color subcategory items
      .addCase(fetchColourSubCategoryItems.fulfilled, (state, action) => {
        const categoryIndex = state.Color.findIndex(
          c => c.colorId === action.payload.colorCategoryId
        );

        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories =
            state.Color[categoryIndex].colorCategories?.map((sub: Category) => {
              if (sub.colorCategoryId === action.payload.colorCategoryId) {
                const existingItemIds = new Set(sub.items.map(i => i.colorItemId));
                const newItems = action.payload.data.colorItems.filter(
                  i => !existingItemIds.has(i.colorItemId)
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
        const categoryIndex = state.Color.findIndex(c =>
          c.colorCategories?.some(
            (sub: Category) => sub.colorCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories = state.Color[
            categoryIndex
          ].colorCategories.map((subCategory: Category) =>
            subCategory.colorCategoryId === action.payload.colorSubCategoryId
              ? {
                  ...subCategory,
                  items: [...(subCategory.items || []), action.payload],
                }
              : subCategory
          );
        }
      })
      .addCase(updateColourSubCategoryItem.fulfilled, (state, action) => {
        const categoryIndex = state.Color.findIndex(c =>
          c.colorCategories?.some(
            (sub: Category) => sub.colorCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories = state.Color[
            categoryIndex
          ].colorCategories.map((subCategory: Category) =>
            subCategory.colorCategoryId === action.payload.colorSubCategoryId
              ? {
                  ...subCategory,
                  items:
                    subCategory.items?.map(item =>
                      item.colorItemId === action.payload.colorItemId ? action.payload : item
                    ) || [],
                }
              : subCategory
          );
        }
      })
      .addCase(deleteColourSubCategoryItem.fulfilled, (state, action) => {
        const categoryIndex = state.Color.findIndex(c =>
          c.colorCategories?.some(
            (sub: Category) => sub.colorCategoryId === action.payload.colorSubCategoryId
          )
        );

        if (categoryIndex !== -1) {
          state.Color[categoryIndex].colorCategories = state.Color[
            categoryIndex
          ].colorCategories.map((subCategory: Category) =>
            subCategory.colorCategoryId === action.payload.colorSubCategoryId
              ? {
                  ...subCategory,
                  items:
                    subCategory.items?.filter(
                      item => item.colorItemId !== action.payload.colorItemId
                    ) || [],
                }
              : subCategory
          );
        }
      })


      //color group

      .addCase(fetchColourGroups.fulfilled, (state, action) => {
        state.ColorGroup = action.payload.colorGroups;
      })
      .addCase(updateColourGroup.fulfilled,(state,action)=>{
        const groupIndex = state.ColorGroup.findIndex(g => g.colorGroupId === action.payload.colorGroupId);
        if(groupIndex !== -1){
          state.ColorGroup[groupIndex] = action.payload;
        }
      })
      .addCase(deleteColourGroup.fulfilled,(state,action)=>{
        const deletedId = action.payload.deletedId;
        const groupIndex = state.ColorGroup.findIndex(g => g.colorGroupId === deletedId);
        if(groupIndex !== -1){
          state.ColorGroup.splice(groupIndex,1);
        }
      })
      .addCase(createColourGroup.fulfilled,(state,action)=>{
        state.ColorGroup.unshift(action.payload);
      })
  },
});

export const { toggleExpandColourCategory, toggleExpandColourCategoryItem } = ColourSlice.actions;
export default ColourSlice.reducer;
