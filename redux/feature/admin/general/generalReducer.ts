import { combineReducers } from '@reduxjs/toolkit';
import generalSettingReducer from './generalSetting/generalSettingSlice';
import serveyorReducer from './surveyor/surveyorSlice';
// import customFieldReducer from './customField/customFieldSlice';
import noteTagsReducer from './notesTag/notesTagSlice';
// import checklistReducer from './checklist/checklistSlice';
// import screenReducer from './screen/screenSlice';
// import functionalityReducer from './functionality/functionalitySlice';
import passwordPolicyReducer from './passwordPolicy/passwordPolicySlice';
// import checklistItemsReducer from './checklistItem/checklistItemSlice';

export const generalReducer = combineReducers({
  generalSetting: generalSettingReducer,
  surveyor: serveyorReducer,
  // customField: customFieldReducer,
  noteTags: noteTagsReducer,
  // checklist: checklistReducer,
  // checklistItems: checklistItemsReducer,
  // screen: screenReducer,
  // functionality: functionalityReducer,
  passwordPolicy: passwordPolicyReducer,
});
