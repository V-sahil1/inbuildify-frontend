import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IContactState } from './contactState';
import { createContact, fetchAllContact, updateContact, deleteContact } from './contactThunk';

const initialState: IContactState = {
  contact: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createContact.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      state.contact.unshift(action.payload);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createContact.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllContact.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllContact.fulfilled, (state, action) => {
      state.contact = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllContact.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateContact.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.contact = state.contact.map(contact =>
        contact.usersId === action.payload.usersId ? action.payload : contact
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateContact.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteContact.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contact = state.contact.filter(contact => contact.usersId !== action.meta.arg);
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteContact.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});

export default contactSlice.reducer;
