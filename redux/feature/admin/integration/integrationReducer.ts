import { combineReducers } from '@reduxjs/toolkit';
import integrationOptionalReducer from './optionalSetting/integrationOptionalSlice';

const integrationReducer = combineReducers({
  optionalSetting: integrationOptionalReducer,
});

export default integrationReducer;
