import { combineReducers } from '@reduxjs/toolkit';
import processReducer from './process/processSlice';
import settingReducer from './setting/settingSlice';
import leadSourceReducer from './leadSource/leadSourceSlice';
import leadLostReasonReducer from './leadLostReason/leadLostReasonSlice';
import clientTypeReducer from './clientType/clientTypeSlice';
import quotationReducer from './quotation/quotationSlice';
import hlPackageSettingReducer from './hlPackage/hlPackageSlice';
import rangeReducer from './range/rangeSlice';
import dwellingTypeReducer from './dwellingType/dwellingTypeSlice';

export const salesReducer = combineReducers({
  process: processReducer,
  setting: settingReducer,
  leadSource: leadSourceReducer,
  leadLostReason: leadLostReasonReducer,
  clientType: clientTypeReducer,
  quotation: quotationReducer,
  hlPackageSetting: hlPackageSettingReducer,
  range: rangeReducer,
  dwellingType: dwellingTypeReducer,
});
