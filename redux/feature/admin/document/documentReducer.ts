import { combineReducers } from '@reduxjs/toolkit';
import areaReducer from './area/documentAreaSlice'
import fileNamingReducer from './fileNaming/fileNamingSlice'
import folderMappingReducer from './folderMapping/folderMappingSlice'

export const documentReducer = combineReducers({
  area:areaReducer,
  files:fileNamingReducer,
  folderMapping:folderMappingReducer
});
