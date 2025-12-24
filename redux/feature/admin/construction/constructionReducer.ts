import { combineReducers } from '@reduxjs/toolkit';
import constructionTypeReducer from './constructionType/constructionTypeSlice';
import constructionStageReducer from './constructionStage/constructionStageSlice';

export const constructionReducer = combineReducers({
  constructionType: constructionTypeReducer,
  constructionStage: constructionStageReducer,
});
