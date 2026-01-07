import { combineReducers } from '@reduxjs/toolkit'
import emailTemplateReducer from './email/emailSlice'

export const templateReducer = combineReducers({
  emailTemplate: emailTemplateReducer,
});
