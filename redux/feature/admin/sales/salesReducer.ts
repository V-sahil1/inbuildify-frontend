import { combineReducers } from '@reduxjs/toolkit';
import processReducer from './process/processSlice';
import settingReducer from './setting/settingSlice';
import leadSourceReducer from './leadSource/leadSourceSlice';
import stageReducer from './stage/stageSlice';
import leadLostReasonReducer from './leadLostReason/leadLostReasonSlice';
import clientTypeReducer from './clientType/clientTypeSlice';

export const salesReducer = combineReducers({
  process: processReducer,
  stage: stageReducer,
  setting: settingReducer,
  leadSource: leadSourceReducer,
  leadLostReason: leadLostReasonReducer,
  clientType: clientTypeReducer,
});
