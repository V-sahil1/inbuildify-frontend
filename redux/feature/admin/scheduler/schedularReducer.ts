import { combineReducers } from '@reduxjs/toolkit';
import schedularSettingReducer from './schedularSetting/schedularSettingSlice';
import scheduleEmailReducer from './schedularEmail/scheduleEmailSlice';

export const schedularReducer = combineReducers({
  schedularSetting: schedularSettingReducer,
  scheduleEmail: scheduleEmailReducer
});
