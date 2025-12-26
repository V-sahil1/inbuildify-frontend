import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ICustomFieldState } from './ICustomFieldState';
import {
  createCustomField,
  createCustomFieldListOption,
  deleteCustomField,
  deleteCustomFieldListOption,
  fetchAllCustomField,
  fetchAllCustomFieldModule,
  updateCustomField,
} from './customFieldThunk';

const initialState: ICustomFieldState = {
  customField: [],
  customFieldModule: [],
  status: {
    customFieldModule: Status.IDLE,
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const customFieldSlice = createSlice({
  name: 'customField',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createCustomField.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createCustomField.fulfilled, (state, action) => {
      state.customField.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createCustomField.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllCustomField.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCustomField.fulfilled, (state, action) => {
      state.customField = action.payload.customFields;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllCustomField.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateCustomField.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateCustomField.fulfilled, (state, action) => {
      state.customField = state.customField.map(i =>
        i.customFieldId === action.payload.customFieldId ? action.payload : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateCustomField.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(deleteCustomField.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteCustomField.fulfilled, (state, action) => {
      state.customField = state.customField.filter(i => i.customFieldId !== action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteCustomField.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(fetchAllCustomFieldModule.pending, state => {
      state.status.customFieldModule = Status.PENDING;
    });
    builder.addCase(fetchAllCustomFieldModule.fulfilled, (state, action) => {
      state.customFieldModule = action.payload.customFieldModules;
      state.status.customFieldModule = Status.SUCCESS;
    });
    builder.addCase(fetchAllCustomFieldModule.rejected, state => {
      state.status.customFieldModule = Status.ERROR;
    });

    builder.addCase(createCustomFieldListOption.fulfilled, (state, action) => {
      state.customField = state.customField.map(i =>
        i.customFieldId === action.payload.customFieldId ? action.payload : i
      );
    });
    builder.addCase(deleteCustomFieldListOption.fulfilled, (state, action) => {
      state.customField = state.customField.map(i =>
        i.customFieldId === action.payload.customFieldId ? action.payload : i
      );
    });
  },
});
export default customFieldSlice.reducer;
