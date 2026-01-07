import { combineReducers } from '@reduxjs/toolkit'
import emailTemplateReducer from './email/emailSlice'
import emailSignatureReducer from './emailSignature/emailSignatureSlice'

export const templateReducer = combineReducers({
  emailTemplate: emailTemplateReducer,
  emailSignature: emailSignatureReducer,
});
