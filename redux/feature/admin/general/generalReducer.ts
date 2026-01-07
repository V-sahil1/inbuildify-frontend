import { combineReducers } from '@reduxjs/toolkit';
import generalSettingReducer from './generalSetting/generalSettingSlice';
import companyReducer from './company/companySlice';
import serveyorReducer from './surveyor/surveyorSlice';
import customFieldReducer from './customField/customFieldSlice';
import noteTagsReducer from './notesTag/notesTagSlice';
import checklistReducer from './checklist/checklistSlice';
import screenReducer from './screen/screenSlice';
import passwordPolicyReducer from './passwordPolicy/passwordPolicySlice';
import roleAndUserMappingReducer from './roleAndUserMapping/roleAndMappingSlice';
import builderReducer from './builder/builderSlice';

export const generalReducer = combineReducers({
  generalSetting: generalSettingReducer,
  company: companyReducer,
  builder: builderReducer,
  surveyor: serveyorReducer,
  customField: customFieldReducer,
  noteTags: noteTagsReducer,
  checklist: checklistReducer,
  screen: screenReducer,
  passwordPolicy: passwordPolicyReducer,
  roleAndUserMapping: roleAndUserMappingReducer
});
