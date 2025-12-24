import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ICustomFieldState } from './ICustomFieldState';
import { createCustomField, deleteCustomField, fetchAllCustomField, fetchAllCustomFieldModule, updateCustomField } from './customFieldThunk';

const initialState:ICustomFieldState  = {
  customField: [],
  customFieldModule:[],
  status: {
    customFieldModule:Status.IDLE,
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const customFieldSlice = createSlice({
  name: 'customField',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createCustomField.fulfilled, (state, action) => {
      state.customField.unshift(action.payload);
    });
    builder.addCase(fetchAllCustomField.fulfilled, (state, action) => {
      state.customField = action.payload.customFields;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(updateCustomField.fulfilled, (state, action) => {
      state.customField = state.customField.map((i => i.customFieldId === action.payload.customFieldId ? action.payload : i))
    });
    builder.addCase(deleteCustomField.fulfilled, (state, action) => {
      state.customField = state.customField.filter((i => i.customFieldId !== action.payload))
    });
    builder.addCase(fetchAllCustomFieldModule.fulfilled, (state, action) => {
      state.customFieldModule = action.payload.customFieldModules;
      state.status.fetch = Status.SUCCESS;
    });
  },
});
export default customFieldSlice.reducer;
