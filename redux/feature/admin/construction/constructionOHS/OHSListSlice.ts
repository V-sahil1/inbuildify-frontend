import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';

import { IOHSListState, OHSListSetting } from './IOHSListState';
import {
  createOHSItem,
  deleteOHSItem,
  fetchAllOHSItem,
  fetchOHSSetting,
  updateOHSItem,
  updateOHSSetting,
} from './OHSListThunk';

const initialState: IOHSListState = {
  setting: <OHSListSetting>{},
  ohsCategory: [],
  status: {
    setting: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    ohsCategory: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    ohsItem: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const OHSListSlice = createSlice({
  name: 'OHSList',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const category = state.ohsCategory.find(c => c.constructionOhsListId === action.payload);
      if (category) {
        category.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    //ohs setting
    builder.addCase(updateOHSSetting.pending, state => {
      state.status.setting.create = Status.PENDING;
    });
    builder.addCase(updateOHSSetting.fulfilled, (state, action) => {
      state.setting = action.payload;
      state.status.setting.create = Status.SUCCESS;
    });
    builder.addCase(updateOHSSetting.rejected, state => {
      state.status.setting.create = Status.ERROR;
    });
    builder.addCase(fetchOHSSetting.pending, state => {
      state.status.setting.fetch = Status.PENDING;
    });
    builder.addCase(fetchOHSSetting.fulfilled, (state, action) => {
      state.setting = action.payload;
      state.status.setting.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchOHSSetting.rejected, state => {
      state.status.setting.fetch = Status.ERROR;
    });

    //ohs item item
    builder.addCase(createOHSItem.pending, (state, action) => {
      state.status.ohsItem.create = Status.PENDING;
    });
    builder.addCase(createOHSItem.fulfilled, (state, action) => {
      const category = state.ohsCategory.find(
        item => item.constructionOhsListId === action.payload.parentId
      );
      if (category) {
        category.items.push(action.payload);
      }
      state.status.ohsItem.create = Status.SUCCESS;
    });
    builder.addCase(createOHSItem.rejected, (state, action) => {
      state.status.ohsItem.create = Status.ERROR;
    });
    builder.addCase(fetchAllOHSItem.pending, (state, action) => {
      if (action.meta.arg.fieldType === 'category') {
        state.status.ohsCategory.fetch = Status.PENDING;
      } else {
        state.status.ohsItem.fetch = Status.PENDING;
      }
    });
    builder.addCase(fetchAllOHSItem.fulfilled, (state, action) => {
      if (action.payload.fieldType === 'category') {
        state.ohsCategory = action.payload.data.map(i => ({ ...i, items: [], isExpanded: false }));
        state.status.ohsCategory.fetch = Status.SUCCESS;
      } else {
        const category = state.ohsCategory.find(
          item => item.constructionOhsListId === action.payload.id
        );
        if (category) {
          category.items = action.payload.data;
        }
        state.status.ohsItem.fetch = Status.SUCCESS;
      }
    });
    builder.addCase(fetchAllOHSItem.rejected, (state, action) => {
      if (action.meta.arg.fieldType === 'category') {
        state.status.ohsCategory.fetch = Status.ERROR;
      } else {
        state.status.ohsItem.fetch = Status.ERROR;
      }
    });

    builder.addCase(updateOHSItem.pending, (state, action) => {
      if (action.meta.arg.data.fieldType === 'category') {
        state.status.ohsCategory.create = Status.PENDING;
      } else {
        state.status.ohsItem.create = Status.PENDING;
      }
    });
    builder.addCase(updateOHSItem.fulfilled, (state, action) => {
      if (action.payload.fieldType === 'category') {
        state.ohsCategory = state.ohsCategory.map(item =>
          item.constructionOhsListId === action.payload.constructionOhsListId
            ? { ...item, ...action.payload }
            : item
        );
        state.status.ohsCategory.create = Status.SUCCESS;
      } else {
        const category = state.ohsCategory.find(
          item => item.constructionOhsListId === action.payload.parentId
        );
        if (category) {
          category.items = category.items.map(i =>
            i.constructionOhsListId === action.payload.constructionOhsListId ? action.payload : i
          );
        }
        state.status.ohsItem.create = Status.SUCCESS;
      }
    });
    builder.addCase(updateOHSItem.rejected, (state, action) => {
      if (action.meta.arg.data.fieldType === 'category') {
        state.status.ohsCategory.fetch = Status.ERROR;
      } else {
        state.status.ohsItem.fetch = Status.ERROR;
      }
    });

    builder.addCase(deleteOHSItem.pending, (state, action) => {
      state.status.ohsItem.create = Status.PENDING;
    });
    builder.addCase(deleteOHSItem.fulfilled, (state, action) => {
      const category = state.ohsCategory.find(
        i => i.constructionOhsListId === action.payload.parentId
      );
      if (category) {
        category.items = category.items.filter(i => i.constructionOhsListId !== action.payload.id);
      }
      state.status.ohsItem.create = Status.SUCCESS;
    });
    builder.addCase(deleteOHSItem.rejected, (state, action) => {
      state.status.ohsItem.create = Status.ERROR;
    });
  },
});
export const { toggleExpand } = OHSListSlice.actions;
export default OHSListSlice.reducer;
