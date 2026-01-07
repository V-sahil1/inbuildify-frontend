import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchEmailTemplate, updateEmailTemplate } from './emailThunk';
import { IEmailTemplateState } from './IemailState';

const initialState: IEmailTemplateState = {
  emailTemplate: [],
  count: {
    total: 0,
    standard: 0,
    customized: 0,
  },
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const EmailTemplateSlice = createSlice({
  name: 'emailTemplate',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEmailTemplate.pending, (state) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchEmailTemplate.fulfilled, (state, action) => {
      state.emailTemplate = action.payload.templates;
      state.count = action.payload.count;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchEmailTemplate.rejected, (state) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updateEmailTemplate.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updateEmailTemplate.fulfilled, (state, action) => {

      const emailTemplate = state.emailTemplate.find(template => 
        template.templateEmailId === action.payload.templateEmailId
      );
      if (emailTemplate) {
        Object.assign(emailTemplate, action.payload);
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updateEmailTemplate.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default EmailTemplateSlice.reducer;
