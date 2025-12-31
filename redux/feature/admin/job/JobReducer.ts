import { combineReducers } from '@reduxjs/toolkit';
import JobSettingReducer from './jobSetting/jobSettingSlice';
import JobColorReducer from './jobColor/jobColorSlice';
import JobWorkflowReducer from './jobWorkflow/jobWorkflowSlice';

export const JobReducer = combineReducers({
  jobSetting: JobSettingReducer,
  jobColor: JobColorReducer,
  jobWorkflow: JobWorkflowReducer,
});
