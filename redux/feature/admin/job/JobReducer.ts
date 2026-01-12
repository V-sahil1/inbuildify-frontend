import { combineReducers } from '@reduxjs/toolkit';
import JobSettingReducer from './jobSetting/jobSettingSlice';
import JobProcessReducer from './jobProcess/jobProcessSlice';
import JobColorReducer from './jobColor/jobColorSlice';
import JobWorkflowReducer from './jobWorkflow/jobWorkflowSlice';
import JobInvoiceReducer from './jobInvoice/jobInvoiceSlice';
import JobVariationReducer from './jobVariation/jobVariationSlice';
import JobCommissionReducer from './jobCommission/jobCommissionSlice';

export const JobReducer = combineReducers({
  jobSetting: JobSettingReducer,
  jobProcess: JobProcessReducer,
  jobColor: JobColorReducer,
  jobWorkflow: JobWorkflowReducer,
  jobInvoice: JobInvoiceReducer,
  jobVariation: JobVariationReducer,
  jobCommission: JobCommissionReducer,
});
