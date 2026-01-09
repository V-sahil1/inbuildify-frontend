import { combineReducers } from '@reduxjs/toolkit';
import emailTemplateReducer from './email/emailSlice';
import emailSignatureReducer from './emailSignature/emailSignatureSlice';
import notesTemplateReducer from './notes/notesSlice';
import pdfTemplateReducer from './pdf/pdfTemplateSlice';

export const templateReducer = combineReducers({
  emailTemplate: emailTemplateReducer,
  emailSignature: emailSignatureReducer,
  notesTemplate: notesTemplateReducer,
  pdfTemplate: pdfTemplateReducer
});
