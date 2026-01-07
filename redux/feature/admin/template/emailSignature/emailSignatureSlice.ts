import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchEmailSignature, updateEmailSignature } from './emailSignatureThunk';
import { IEmailSignatureState } from './IemailSignatureState';

const initialState: IEmailSignatureState = {
  emailSignature: {
    includeEmailSignature: false,
    signatureContent: '',
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const EmailSignatureSlice = createSlice({
  name: 'emailSignature',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEmailSignature.pending, (state) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchEmailSignature.fulfilled, (state, action) => {
      state.emailSignature = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchEmailSignature.rejected, (state) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateEmailSignature.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateEmailSignature.fulfilled, (state, action) => {
      state.emailSignature = action.payload;
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateEmailSignature.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default EmailSignatureSlice.reducer;
