import { combineReducers } from '@reduxjs/toolkit';
import areaReducer from './area/documentAreaSlice'
import fileNamingReducer from './fileNaming/fileNamingSlice'

export const documentReducer = combineReducers({
  area:areaReducer,
  files:fileNamingReducer 
});
