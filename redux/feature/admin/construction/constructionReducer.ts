import { combineReducers } from '@reduxjs/toolkit';
import constructionTypeReducer from './constructionType/constructionTypeSlice';
import constructionStageReducer from './constructionStage/constructionStageSlice';
import constructionSettingReducer from './construtionSetting/constructionSettingSlice';
import constructionOptionReducer from './constructionOption/construtionOptionSlice'
import etsRechargeReducer from './constructionETSRecharge/ETSRechargeSlice'

export const constructionReducer = combineReducers({
  setting: constructionSettingReducer,
  constructionOption:constructionOptionReducer,
  constructionType: constructionTypeReducer,
  constructionStage: constructionStageReducer,
  etsRecharge:etsRechargeReducer
});
