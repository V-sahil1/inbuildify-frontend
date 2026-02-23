import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createColour,
  createColourGroup,
  createColourItem,
  deleteColour,
  deleteColourGroup,
  deleteColourCategory,
  deleteColourItem,
  fetchAllColour,
  fetchColourGroups,
  fetchColourCategory,
  fetchColourItems,
  updateColour,
  updateColourGroup,
  updateColourCategory,
  updateColourItem,
  createColourCategory,
  copyColour,
  copyColorCategory,
  fetchColourType,
  deleteColourType,
  updateColourType,
  createColourType,
  copyColourItem,
  moveColourItem,
  fetchColourItemCustomField,
  createColourItemCustomField,
  updateColourItemCustomField,
  deleteColourItemCustomField,
  fetchColourGroupItem,
  createColourGroupItem,
  deleteColourGroupItem,
  fetchColourGroupItems,
} from './colorThunk';
import { ColorInitialState, Category } from './iColourState';

const initialState: ColorInitialState = {
  status: {
    color: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    category: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    group: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    colorItem: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    colorType: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    colorItemCustomField: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    colorGroupItem: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
  color: [],
  colorGroup: [],
  colorType: [],
  colorItems: [],
};
const ColourSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    toggleExpandColourCategory(state, action) {
      const color = state.color.find(c => c.colorId === action.payload);
      if (color) {
        color.isExpanded = true;
      }
    },
    toggleExpandColourCategoryItem(state, action) {
      const { colorCategoryId, colorId } = action.payload;

      const colorCategory = state.color.find(c => c.colorId === colorId);

      if (colorCategory) {
        const subCategory = colorCategory.colorCategories.find(
          sc => sc.colorCategoryId === colorCategoryId
        );

        if (subCategory) {
          subCategory.isExpanded = true;
        }
      }
    },

    resetAllCategoriesIsExpanded(state) {
      state.color.forEach(category => {
        category.isExpanded = false;
      });
    },
  },
  extraReducers: builder => {
    builder
      // color category
      .addCase(fetchAllColour.pending, state => {
        state.status.color.fetch = Status.PENDING;
      })
      .addCase(fetchAllColour.fulfilled, (state, action) => {
        state.status.color.fetch = Status.SUCCESS;
        state.color = action.payload?.colors?.map(c => ({
          ...c,
          colorCategories: [],
          isExpanded: false,
        }));
      })
      .addCase(fetchAllColour.rejected, state => {
        state.status.color.fetch = Status.ERROR;
      })
      .addCase(createColour.pending, state => {
        state.status.color.create = Status.PENDING;
      })
      .addCase(createColour.fulfilled, (state, action) => {
        state.status.color.create = Status.SUCCESS;
        state.color.unshift({
          ...action.payload,
          colorCategories: [],
          isExpanded: false,
        });
      })
      .addCase(createColour.rejected, state => {
        state.status.color.create = Status.ERROR;
      })
      .addCase(updateColour.pending, state => {
        state.status.color.create = Status.PENDING;
      })
      .addCase(updateColour.fulfilled, (state, action) => {
        state.status.color.create = Status.SUCCESS;
        state.color = state.color.map(i =>
          i.colorId === action.payload.colorId ? { ...i, ...action.payload } : i
        );
      })
      .addCase(updateColour.rejected, state => {
        state.status.color.create = Status.ERROR;
      })
      .addCase(deleteColour.pending, state => {
        state.status.color.create = Status.PENDING;
      })
      .addCase(deleteColour.fulfilled, (state, action) => {
        state.status.color.create = Status.SUCCESS;
        state.color = state.color.filter(c => c.colorId !== action.payload.colorId);
      })
      .addCase(deleteColour.rejected, state => {
        state.status.color.create = Status.ERROR;
      })

      .addCase(copyColour.pending, state => {
        state.status.color.create = Status.PENDING;
      })
      .addCase(copyColour.fulfilled, (state, action) => {
        state.status.color.create = Status.SUCCESS;
        const color = state.color.find(i => i.colorId === action.meta.arg.id);
        state.color.unshift({
          ...color,
          ...action.payload,
          isExpanded: false,
        });
      })
      .addCase(copyColour.rejected, state => {
        state.status.color.create = Status.ERROR;
      });

    // color subcategory
    builder
      .addCase(fetchColourCategory.pending, state => {
        state.status.category.fetch = Status.PENDING;
      })
      .addCase(fetchColourCategory.fulfilled, (state, action) => {
        state.status.category.fetch = Status.SUCCESS;

        const category = state.color.find(c => c.colorId === action.payload.colorId);
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
      .addCase(fetchColourCategory.rejected, state => {
        state.status.category.fetch = Status.ERROR;
      })
      .addCase(createColourCategory.pending, state => {
        state.status.category.create = Status.PENDING;
      })
      .addCase(createColourCategory.fulfilled, (state, action) => {
        state.status.category.create = Status.SUCCESS;
        const category = state.color.find(c => c.colorId === action.payload.colorId);
        category?.colorCategories.unshift({
          ...action.payload,
          items: [],
          isExpanded: false,
        });
      })
      .addCase(createColourCategory.rejected, state => {
        state.status.category.create = Status.ERROR;
      })
      .addCase(updateColourCategory.pending, state => {
        state.status.category.create = Status.PENDING;
      })
      .addCase(updateColourCategory.fulfilled, (state, action) => {
        state.status.category.create = Status.SUCCESS;
        const categoryIndex = state.color.findIndex(c => c.colorId === action.payload.colorId);

        if (categoryIndex !== -1) {
          state.color[categoryIndex].colorCategories = state.color[
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
      .addCase(updateColourCategory.rejected, state => {
        state.status.category.create = Status.ERROR;
      })
      .addCase(deleteColourCategory.pending, state => {
        state.status.category.create = Status.PENDING;
      })
      .addCase(deleteColourCategory.fulfilled, (state, action) => {
        state.status.category.create = Status.SUCCESS;
        const categoryIndex = state.color.findIndex(c => c.colorId === action.meta.arg.colorId);
        if (categoryIndex !== -1) {
          state.color[categoryIndex].colorCategories = state.color[
            categoryIndex
          ].colorCategories.filter(
            (c: Category) => c.colorCategoryId !== action.meta.arg.colorCategoryId
          );
        }
      })
      .addCase(deleteColourCategory.rejected, state => {
        state.status.category.create = Status.ERROR;
      })
      .addCase(copyColorCategory.pending, state => {
        state.status.color.create = Status.PENDING;
      })
      .addCase(copyColorCategory.fulfilled, (state, action) => {
        state.status.color.create = Status.SUCCESS;
        const prevColor = state.color.find(i => i.colorId === action.meta.arg.colorId);
        const category = prevColor?.colorCategories.find(
          i => i.colorCategoryId === action.meta.arg.id
        );
        const color = state.color.find(i => i.colorId === action.payload.colorId);
        if (color) {
          color.colorCategories.push({ ...category, ...action.payload });
        }
      })
      .addCase(copyColorCategory.rejected, state => {
        state.status.color.create = Status.ERROR;
      })

      // color category items
      .addCase(fetchColourItems.pending, state => {
        state.status.colorItem.fetch = Status.PENDING;
      })
      .addCase(fetchColourItems.fulfilled, (state, action) => {
        state.status.colorItem.fetch = Status.SUCCESS;
        const color = state.color.find(c => c.colorId === action.meta.arg.colorId);
        if (color) {
          const category = color.colorCategories.find(
            i => i.colorCategoryId === action.meta.arg.colorCategoryId
          );
          if (category) {
            category.items = action.payload.colorItems;
          }
        }
      })
      .addCase(fetchColourItems.rejected, state => {
        state.status.colorItem.fetch = Status.ERROR;
      })
      .addCase(createColourItem.pending, state => {
        state.status.colorItem.create = Status.PENDING;
      })

      .addCase(createColourItem.fulfilled, (state, action) => {
        state.status.colorItem.create = Status.SUCCESS;
        if (!!action.payload.colorCategoryId) {
          const color = state.color.find(c =>
            c.colorCategories.find(i => i.colorCategoryId === action.payload.colorCategoryId)
          );
          if (color) {
            const category = color.colorCategories.find(
              i => i.colorCategoryId === action.payload.colorCategoryId
            );
            if (category) {
              category.items.unshift(action.payload);
            }
          }
        } else {
          state.colorItems.unshift({ ...action.payload, colorGroups: [] });
        }
      })
      .addCase(createColourItem.rejected, state => {
        state.status.colorItem.create = Status.ERROR;
      })
      .addCase(updateColourItem.pending, state => {
        state.status.colorItem.create = Status.PENDING;
      })
      .addCase(updateColourItem.fulfilled, (state, action) => {
        state.status.colorItem.create = Status.SUCCESS;
        if (!!action.payload.colorCategoryId) {
          const categoryIndex = state.color.findIndex(c =>
            c.colorCategories?.some(
              (sub: Category) => sub.colorCategoryId === action.payload.colorCategoryId
            )
          );

          if (categoryIndex !== -1) {
            state.color[categoryIndex].colorCategories = state.color[
              categoryIndex
            ].colorCategories.map((subCategory: Category) =>
              subCategory.colorCategoryId === action.payload.colorCategoryId
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
        } else {
          state.colorItems = state.colorItems.map(i =>
            i.colorItemId === action.payload.colorItemId ? { ...i, ...action.payload } : i
          );
        }
      })
      .addCase(updateColourItem.rejected, state => {
        state.status.colorItem.create = Status.ERROR;
      })
      .addCase(deleteColourItem.pending, state => {
        state.status.colorItem.create = Status.PENDING;
      })
      .addCase(deleteColourItem.fulfilled, (state, action) => {
        state.status.colorItem.create = Status.SUCCESS;
        if (!!action.meta.arg?.colorCategoryId) {
          const color = state.color.find(c =>
            c.colorCategories.find(i => i.colorCategoryId === action.meta.arg.colorCategoryId)
          );
          if (color) {
            const category = color.colorCategories.find(
              i => i.colorCategoryId === action.meta.arg.colorCategoryId
            );
            if (category) {
              category.items = category.items.filter(i => i.colorItemId !== action.meta.arg.id);
            }
          }
        } else {
          state.colorItems = state.colorItems.filter(i => i.colorItemId === action.meta.arg.id);
        }
      })
      .addCase(deleteColourItem.rejected, state => {
        state.status.colorItem.create = Status.ERROR;
      })

      .addCase(copyColourItem.pending, state => {
        state.status.colorItem.create = Status.PENDING;
      })
      .addCase(copyColourItem.fulfilled, (state, action) => {
        state.status.colorItem.create = Status.SUCCESS;
        const color = state.color.find(c => c.colorId === action.meta.arg.data.colorId);
        if (color) {
          const category = color.colorCategories.find(
            i => i.colorCategoryId === action.meta.arg.data.colorCategoryId
          );
          if (category) {
            category.items.unshift(action.payload);
          }
        }
      })
      .addCase(copyColourItem.rejected, state => {
        state.status.colorItem.create = Status.ERROR;
      })

      .addCase(moveColourItem.pending, state => {
        state.status.colorItem.create = Status.PENDING;
      })
      .addCase(moveColourItem.fulfilled, (state, action) => {
        state.status.colorItem.create = Status.SUCCESS;
        const oldColor = state.color.find(i =>
          i.colorCategories.find(i => i.colorCategoryId === action.meta.arg.colorCategoryId)
        );
        if (oldColor) {
          const category = oldColor.colorCategories.find(
            i => i.colorCategoryId === action.meta.arg.colorCategoryId
          );
          if (category) {
            category.items = category.items.filter(i => i.colorItemId !== action.meta.arg.id);
          }
        }
        const color = state.color.find(c => c.colorId === action.meta.arg.data.colorId);
        if (color) {
          const category = color.colorCategories.find(
            i => i.colorCategoryId === action.meta.arg.data.colorCategoryId
          );
          if (category) {
            category.items.unshift(action.payload);
          }
        }
      })
      .addCase(moveColourItem.rejected, state => {
        state.status.colorItem.create = Status.ERROR;
      })
      .addCase(fetchColourGroupItems.pending, state => {
        state.status.colorGroupItem.fetch = Status.PENDING;
      })
      .addCase(fetchColourGroupItems.fulfilled, (state, action) => {
        state.colorItems = action.payload;
        state.status.colorGroupItem.fetch = Status.SUCCESS;
      })
      .addCase(fetchColourGroupItems.rejected, state => {
        state.status.colorGroupItem.fetch = Status.ERROR;
      })

      //color group
      .addCase(fetchColourGroups.pending, state => {
        state.status.group.fetch = Status.PENDING;
      })
      .addCase(fetchColourGroups.fulfilled, (state, action) => {
        state.status.group.fetch = Status.SUCCESS;
        state.colorGroup = action.payload.map(i => ({ ...i, items: [] }));
      })
      .addCase(fetchColourGroups.rejected, state => {
        state.status.group.fetch = Status.ERROR;
      })
      .addCase(createColourGroup.pending, state => {
        state.status.group.create = Status.PENDING;
      })
      .addCase(createColourGroup.fulfilled, (state, action) => {
        state.status.group.create = Status.SUCCESS;
        state.colorGroup.unshift({ ...action.payload, items: [] });
      })
      .addCase(createColourGroup.rejected, state => {
        state.status.group.create = Status.ERROR;
      })
      .addCase(updateColourGroup.pending, state => {
        state.status.group.create = Status.PENDING;
      })
      .addCase(updateColourGroup.fulfilled, (state, action) => {
        state.status.group.create = Status.SUCCESS;
        const groupIndex = state.colorGroup.findIndex(
          g => g.colorGroupId === action.payload.colorGroupId
        );
        if (groupIndex !== -1) {
          state.colorGroup[groupIndex] = { ...state.colorGroup[groupIndex], ...action.payload };
        }
      })
      .addCase(updateColourGroup.rejected, state => {
        state.status.group.create = Status.ERROR;
      })
      .addCase(deleteColourGroup.pending, state => {
        state.status.group.create = Status.PENDING;
      })
      .addCase(deleteColourGroup.fulfilled, (state, action) => {
        state.status.group.create = Status.SUCCESS;
        const deletedId = action.payload.deletedId;
        const groupIndex = state.colorGroup.findIndex(g => g.colorGroupId === deletedId);
        if (groupIndex !== -1) {
          state.colorGroup.splice(groupIndex, 1);
        }
        state.colorItems = state.colorItems.map(i => ({
          ...i,
          colorGroups: i.colorGroups?.filter(g => g.colorGroupId !== deletedId),
        }));
      })
      .addCase(deleteColourGroup.rejected, state => {
        state.status.group.create = Status.ERROR;
      })

      //color type
      .addCase(fetchColourType.pending, state => {
        state.status.colorType.fetch = Status.PENDING;
      })
      .addCase(fetchColourType.fulfilled, (state, action) => {
        state.status.colorType.fetch = Status.SUCCESS;
        state.colorType = action.payload;
      })
      .addCase(fetchColourType.rejected, state => {
        state.status.colorType.fetch = Status.ERROR;
      })
      .addCase(createColourType.pending, state => {
        state.status.colorType.create = Status.PENDING;
      })
      .addCase(createColourType.fulfilled, (state, action) => {
        state.status.colorType.create = Status.SUCCESS;
        state.colorType.unshift(action.payload);
      })
      .addCase(createColourType.rejected, state => {
        state.status.colorType.create = Status.ERROR;
      })
      .addCase(updateColourType.pending, state => {
        state.status.colorType.create = Status.PENDING;
      })
      .addCase(updateColourType.fulfilled, (state, action) => {
        state.status.colorType.create = Status.SUCCESS;
        state.colorType = state.colorType.map(type =>
          type.colorTypeId === action.payload.colorTypeId ? action.payload : type
        );
      })
      .addCase(updateColourType.rejected, state => {
        state.status.colorType.create = Status.ERROR;
      })
      .addCase(deleteColourType.pending, state => {
        state.status.colorType.create = Status.PENDING;
      })
      .addCase(deleteColourType.fulfilled, (state, action) => {
        state.status.colorType.create = Status.SUCCESS;
        state.colorType = state.colorType.filter(type => type.colorTypeId !== action.meta.arg);
      })
      .addCase(deleteColourType.rejected, state => {
        state.status.colorType.create = Status.ERROR;
      })

      //color item customfield
      .addCase(fetchColourItemCustomField.pending, state => {
        state.status.colorItemCustomField.fetch = Status.PENDING;
      })
      .addCase(fetchColourItemCustomField.fulfilled, (state, action) => {
        state.status.colorItemCustomField.fetch = Status.SUCCESS;
        const parent = state.color.find(i =>
          i.colorCategories.find(i => i.items.find(i => i.colorItemId === action.meta.arg))
        );
        if (parent) {
          const category = parent.colorCategories.find(i =>
            i.items.find(i => i.colorItemId === action.meta.arg)
          );
          if (category) {
            const item = category.items.find(i => i.colorItemId === action.meta.arg);
            if (item) {
              item.customFields = action.payload.colorItemCustomFields;
            }
          }
        }
      })
      .addCase(fetchColourItemCustomField.rejected, state => {
        state.status.colorItemCustomField.fetch = Status.ERROR;
      })
      .addCase(createColourItemCustomField.pending, state => {
        state.status.colorItemCustomField.create = Status.PENDING;
      })
      .addCase(createColourItemCustomField.fulfilled, (state, action) => {
        state.status.colorItemCustomField.create = Status.SUCCESS;
        const parent = state.color.find(i =>
          i.colorCategories.find(i => i.items.find(i => i.colorItemId === action.payload.colorItem))
        );
        if (parent) {
          const category = parent.colorCategories.find(i =>
            i.items.find(i => i.colorItemId === action.payload.colorItem)
          );
          if (category) {
            const item = category.items.find(i => i.colorItemId === action.payload.colorItem);
            if (item) {
              item.customFields.unshift(action.payload);
            }
          }
        }
      })
      .addCase(createColourItemCustomField.rejected, state => {
        state.status.colorItemCustomField.create = Status.ERROR;
      })
      .addCase(updateColourItemCustomField.pending, state => {
        state.status.colorItemCustomField.create = Status.PENDING;
      })
      .addCase(updateColourItemCustomField.fulfilled, (state, action) => {
        state.status.colorItemCustomField.create = Status.SUCCESS;
        const parent = state.color.find(i =>
          i.colorCategories.find(i => i.items.find(i => i.colorItemId === action.payload.colorItem))
        );
        if (parent) {
          const category = parent.colorCategories.find(i =>
            i.items.find(i => i.colorItemId === action.payload.colorItem)
          );
          if (category) {
            const item = category.items.find(i => i.colorItemId === action.payload.colorItem);
            if (item) {
              item.customFields.map(i =>
                i.colorItemCustomFieldId === action.payload.colorItemCustomFieldId
                  ? action.payload
                  : i
              );
            }
          }
        }
      })
      .addCase(updateColourItemCustomField.rejected, state => {
        state.status.colorItemCustomField.create = Status.ERROR;
      })
      .addCase(deleteColourItemCustomField.pending, state => {
        state.status.colorItemCustomField.create = Status.PENDING;
      })
      .addCase(deleteColourItemCustomField.fulfilled, (state, action) => {
        state.status.colorItemCustomField.create = Status.SUCCESS;
        const parent = state.color.find(i =>
          i.colorCategories.find(i =>
            i.items.find(i => i.colorItemId === action.meta.arg.colorItemId)
          )
        );
        if (parent) {
          const category = parent.colorCategories.find(i =>
            i.items.find(i => i.colorItemId === action.meta.arg.colorItemId)
          );
          if (category) {
            const item = category.items.find(i => i.colorItemId === action.meta.arg.colorItemId);
            if (item) {
              item.customFields = item.customFields.filter(
                i => i.colorItemCustomFieldId !== action.meta.arg.id
              );
            }
          }
        }
      })
      .addCase(deleteColourItemCustomField.rejected, state => {
        state.status.colorItemCustomField.create = Status.ERROR;
      })

      //colorGroupItemMap
      .addCase(fetchColourGroupItem.pending, state => {
        state.status.colorType.fetch = Status.PENDING;
      })
      .addCase(fetchColourGroupItem.fulfilled, (state, action) => {
        state.status.colorType.fetch = Status.SUCCESS;
        const group = state.colorGroup.find(i => i.colorGroupId === action.meta.arg);
        if (group) {
          group.items = action.payload.mappings;
        }
      })
      .addCase(fetchColourGroupItem.rejected, state => {
        state.status.colorType.fetch = Status.ERROR;
      })
      .addCase(createColourGroupItem.pending, state => {
        state.status.colorType.create = Status.PENDING;
      })
      .addCase(createColourGroupItem.fulfilled, (state, action) => {
        state.status.colorType.create = Status.SUCCESS;
        const group = state.colorGroup.find(i => i.colorGroupId === action.payload.colorGroupId);
        const item = state.colorItems.findIndex(i => i.colorItemId === action.payload.colorItemId);
        if (item !== -1) {
          state.colorItems[item] = {
            ...state.colorItems[item],
            colorGroups: [
              ...state.colorItems[item].colorGroups,
              {
                colorGroupId: action.payload.colorGroupId,
                colorGroupName: group.name,
              },
            ],
          };
        }
        if (group) {
          group.items.unshift(action.payload);
        }
      })
      .addCase(createColourGroupItem.rejected, state => {
        state.status.colorType.create = Status.ERROR;
      })
      .addCase(deleteColourGroupItem.pending, state => {
        state.status.colorType.create = Status.PENDING;
      })
      .addCase(deleteColourGroupItem.fulfilled, (state, action) => {
        state.status.colorType.create = Status.SUCCESS;
        const group = state.colorGroup.find(i => i.colorGroupId === action.meta.arg.groupId);
        if (group) {
          group.items = group.items.filter(item => item.id !== action.meta.arg.id);
        }
        state.colorItems = state.colorItems.map(i =>
          i.colorItemId === action.meta.arg.itemId
            ? {
                ...i,
                colorGroups: i.colorGroups.filter(g => g.colorGroupId !== action.meta.arg.groupId),
              }
            : i
        );
      })
      .addCase(deleteColourGroupItem.rejected, state => {
        state.status.colorType.create = Status.ERROR;
      });
  },
});

export const {
  toggleExpandColourCategory,
  toggleExpandColourCategoryItem,
  resetAllCategoriesIsExpanded,
} = ColourSlice.actions;
export default ColourSlice.reducer;
