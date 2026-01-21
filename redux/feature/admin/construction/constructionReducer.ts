import { combineReducers } from '@reduxjs/toolkit';
import constructionTypeReducer from './constructionType/constructionTypeSlice';
import constructionStageReducer from './constructionStage/constructionStageSlice';
import constructionSettingReducer from './construtionSetting/constructionSettingSlice';
import constructionOptionReducer from './constructionOption/construtionOptionSlice';
import etsRechargeReducer from './constructionETSRecharge/ETSRechargeSlice';
import ohsListReducer from './constructionOHS/OHSListSlice';
import inspectionChecklistReducer from './InspectionChecklist/InspectionchecklistSlice';
import constructionChecklistReducer from './constructionChecklist/constructionChecklistSlice';

export const constructionReducer = combineReducers({
  setting: constructionSettingReducer,
  constructionOption: constructionOptionReducer,
  constructionType: constructionTypeReducer,
  constructionStage: constructionStageReducer,
  constructionChecklist: constructionChecklistReducer,
  inspectionChecklist: inspectionChecklistReducer,
  ohsList: ohsListReducer,
  etsRecharge: etsRechargeReducer,
});
