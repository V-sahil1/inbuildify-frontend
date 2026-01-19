import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  fetchIntegrationSetting,
  updateIntegrationSetting,
  createCustomFieldHeader,
  fetchAllCustomFieldHeader,
  updateCustomFieldHeader,
  deleteCustomFieldHeader,
  createCustomFieldItem,
  fetchAllCustomFieldItem,
  updateCustomFieldItem,
  deleteCustomFieldItem,
} from './integrationOptionalThunk';
import { IIntegrationSettingState } from './IintegrationOptionalState';

const initialState: IIntegrationSettingState = {
  integrationSetting: null,
  customFields: [],
  customFieldItems: [],
  customFieldItemStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  customFieldStatus: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const IntegrationSettingSlice = createSlice({
  name: 'integrationSetting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchIntegrationSetting.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchIntegrationSetting.fulfilled, (state, action) => {
      state.integrationSetting = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchIntegrationSetting.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateIntegrationSetting.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateIntegrationSetting.fulfilled, (state, action) => {
      state.integrationSetting = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateIntegrationSetting.rejected, state => {
      state.status.update = Status.ERROR;
    });

    //custom field
    builder.addCase(createCustomFieldHeader.pending, state => {
      state.customFieldStatus.update = Status.PENDING;
    });
    builder.addCase(createCustomFieldHeader.fulfilled, (state, action) => {
      state.customFields.push(action.payload);
      state.customFieldStatus.update = Status.SUCCESS;
    });
    builder.addCase(createCustomFieldHeader.rejected, state => {
      state.customFieldStatus.update = Status.ERROR;
    });

    builder.addCase(fetchAllCustomFieldHeader.pending, state => {
      state.customFieldStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCustomFieldHeader.fulfilled, (state, action) => {
      state.customFields = action.payload.integrationCustomFieldHeaders;
      state.customFieldStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllCustomFieldHeader.rejected, state => {
      state.customFieldStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateCustomFieldHeader.pending, state => {
      state.customFieldStatus.update = Status.PENDING;
    });
    builder.addCase(updateCustomFieldHeader.fulfilled, (state, action) => {
      state.customFields = state.customFields.map(i =>
        i.integrationCustomFieldHeaderId === action.payload.integrationCustomFieldHeaderId
          ? action.payload
          : i
      );
      state.customFieldStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateCustomFieldHeader.rejected, state => {
      state.customFieldStatus.update = Status.ERROR;
    });

    builder.addCase(deleteCustomFieldHeader.pending, state => {
      state.customFieldStatus.update = Status.PENDING;
    });
    builder.addCase(deleteCustomFieldHeader.fulfilled, (state, action) => {
      state.customFields = state.customFields.filter(
        i => i.integrationCustomFieldHeaderId !== action.payload
      );

      state.customFieldStatus.update = Status.SUCCESS;
    });
    builder.addCase(deleteCustomFieldHeader.rejected, state => {
      state.customFieldStatus.update = Status.ERROR;
    });

    //custom field item
    builder.addCase(createCustomFieldItem.pending, state => {
      state.customFieldItemStatus.update = Status.PENDING;
    });
    builder.addCase(createCustomFieldItem.fulfilled, (state, action) => {
      state.customFieldItems.push(action.payload);
      state.customFieldItemStatus.update = Status.SUCCESS;
    });
    builder.addCase(createCustomFieldItem.rejected, state => {
      state.customFieldItemStatus.update = Status.ERROR;
    });

    builder.addCase(fetchAllCustomFieldItem.pending, state => {
      state.customFieldItemStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllCustomFieldItem.fulfilled, (state, action) => {
      state.customFieldItems = action.payload.items;
      state.customFieldItemStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllCustomFieldItem.rejected, state => {
      state.customFieldItemStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateCustomFieldItem.pending, state => {
      state.customFieldItemStatus.update = Status.PENDING;
    });
    builder.addCase(updateCustomFieldItem.fulfilled, (state, action) => {
      state.customFieldItems = state.customFieldItems.map(i =>
        i.integrationCustomFieldItemId === action.payload.integrationCustomFieldItemId
          ? action.payload
          : i
      );
      state.customFieldItemStatus.update = Status.SUCCESS;
    });
    builder.addCase(updateCustomFieldItem.rejected, state => {
      state.customFieldItemStatus.update = Status.ERROR;
    });

    builder.addCase(deleteCustomFieldItem.pending, state => {
      state.customFieldItemStatus.update = Status.PENDING;
    });
    builder.addCase(deleteCustomFieldItem.fulfilled, (state, action) => {
      state.customFieldItems = state.customFieldItems.filter(
        i => i.integrationCustomFieldItemId !== action.payload
      );
      state.customFieldItemStatus.update = Status.SUCCESS;
    });
    builder.addCase(deleteCustomFieldItem.rejected, state => {
      state.customFieldItemStatus.update = Status.ERROR;
    });
  },
});
export default IntegrationSettingSlice.reducer;
