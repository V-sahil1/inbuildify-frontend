import { combineReducers } from '@reduxjs/toolkit';
import JobSettingReducer from './jobSetting/jobSettingSlice';
import JobColorReducer from './jobColor/jobColorSlice';
import JobWorkflowReducer from './jobWorkflow/jobWorkflowSlice';
import JobInvoiceReducer from './jobInvoice/jobInvoiceSlice';

export const JobReducer = combineReducers({
  jobSetting: JobSettingReducer,
  jobColor: JobColorReducer,
  jobWorkflow: JobWorkflowReducer,
  jobInvoice: JobInvoiceReducer
});
