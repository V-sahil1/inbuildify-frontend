import { combineReducers } from '@reduxjs/toolkit';
import maintenanceSettingReducer from './maintenanceSetting/maintenanceSettingSlice';
import maintenanceAreaReducer from './maintenanceArea/maintenanceAreaSlice';

export const MaintenanceReducer = combineReducers({
  maintenanceSetting: maintenanceSettingReducer,
  maintenanceArea: maintenanceAreaReducer,
});
