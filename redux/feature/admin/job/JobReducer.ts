import { combineReducers } from '@reduxjs/toolkit';
import JobSettingReducer from './jobSetting/jobSettingSlice';
import JobColorReducer from './jobColor/jobColorSlice';
import JobWorkflowReducer from './jobWorkflow/jobWorkflowSlice';
import JobInvoiceReducer from './jobInvoice/jobInvoiceSlice';
import JobVariationReducer from './jobVariation/jobVariationSlice';

export const JobReducer = combineReducers({
  jobSetting: JobSettingReducer,
  jobColor: JobColorReducer,
  jobWorkflow: JobWorkflowReducer,
  jobInvoice: JobInvoiceReducer,
  jobVariation: JobVariationReducer
});
