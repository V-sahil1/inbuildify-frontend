import { combineReducers } from '@reduxjs/toolkit';
import JobSettingReducer from './jobSetting/jobSettingSlice';
import JobColorReducer from './jobColor/jobColorSlice';

export const JobReducer = combineReducers({
  jobSetting: JobSettingReducer,
  jobColor: JobColorReducer,
});
