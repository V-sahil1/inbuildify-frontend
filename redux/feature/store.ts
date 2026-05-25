import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth/authSlice';
import { leadReducer } from './lead/leadSlice';
import quotationReducer from './quotation/quotationSlice';
import masterPriceListReducer from './masterPriceList/masterPriceListSlice';
import floorPlanReducer from './floorPlan/floorPlanSlice';
import facadeReducer from './facade/facadeSlice';
import packageReducer from './package/packageSlice';
import { dashboardReducer } from './dashboard/dashboardSlice';
import typesReducer from './types/typesSlice';
import locationReducer from './location/locationSlice';
import contractorReducer from './contractor/contractorSlice';
import actionReducer from './action/actionSlice';
import userReducer from './user/userSlice';
import workflowReducer from './workflow/workflowSlice';
import colourReducer from './color/ColourSlice';
import taskReducer from './task/taskSlice';
import { generalReducer } from './admin/general/generalReducer';
import { salesReducer } from './admin/sales/salesReducer';
import { constructionReducer } from './admin/construction/constructionReducer';
import roleReducer from './admin/role/roleSlice';
import { JobReducer } from './admin/job/JobReducer';
import { MaintenanceReducer } from './admin/maintenance/maintenanceReducer';
import commonReducer from './common/commonSlice';
import userGroupReducer from './userGroup/userGroupSlice';
import { portalReducer } from './admin/portal/portalReducer';
import { schedularReducer } from './admin/scheduler/schedularReducer';
import integrationReducer from './admin/integration/integrationReducer';
import { documentReducer } from './admin/document/documentReducer';
import { templateReducer } from './admin/template/templateReducer';
import driveReducer from './drive/driveSlice';
import supplierReducer from './supplier/supplierSlice';
import costCenterReducer from './costCenter/costCenterSlice';
import surveyTemplateReducer from './surveyTemplate/surveyTemplateSlice';
import holidayReducer from './holiday/holidaySlice';
import contactReducer from './contacts/contactSlice';
import contractFormatReducer from './contractFormat/contractFormatSlice';
import appointMentReducer from './appointment/appointmentSlice';
import agentReferralPartnerReducer from './agentReferral/agentReferralSlice';
import estateReducer from './estate/estateSlice';
import landReducer from './land/landSlice';
import structuralReducer from './structuralengg/structuralSlice';
import jobListReducer from './job/jobSlice';
import todoReducer from './todo/todoSlice';
import quotationFormatReducer from './quotation-format/quotationFormatSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  lead: leadReducer,
  quotation: quotationReducer,
  masterPriceList: masterPriceListReducer,
  floorPlan: floorPlanReducer,
  facade: facadeReducer,
  package: packageReducer,
  dashboard: dashboardReducer,
  types: typesReducer,
  location: locationReducer,
  contractor: contractorReducer,
  action: actionReducer,
  user: userReducer,
  workflow: workflowReducer,
  colour: colourReducer,
  task: taskReducer,
  sales: salesReducer,
  general: generalReducer,
  construction: constructionReducer,
  job: JobReducer,
  role: roleReducer,
  maintenance: MaintenanceReducer,
  common: commonReducer,
  userGroup: userGroupReducer,
  portal: portalReducer,
  schedular: schedularReducer,
  integration: integrationReducer,
  document: documentReducer,
  template: templateReducer,
  supplier: supplierReducer,
  drive: driveReducer,
  costCenter: costCenterReducer,
  surveyTemplate: surveyTemplateReducer,
  holiday: holidayReducer,
  contact: contactReducer,
  contractFormat: contractFormatReducer,
  appointment: appointMentReducer,
  agentReferralPartner: agentReferralPartnerReducer,
  estate: estateReducer,
  land: landReducer,
  structural: structuralReducer,
  jobList: jobListReducer,
  todo: todoReducer,
  quotationFormat: quotationFormatReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === 'auth/logout') {
    storage.removeItem('persist:root');
    storage.removeItem('persist:auth');
    state = undefined;
  }
  return appReducer(state, action);
};

// Do not persist filter dropdown options (stale shape / empty array from older clients
// overwrote fresh API data). Always refill from GET /quotation/filter-options.
const quotationFilterOptionsTransform = createTransform(
  inboundState => {
    if (!inboundState || typeof inboundState !== 'object') return inboundState;
    const { quotationFilterOptions: _removed, ...rest } = inboundState as Record<string, unknown>;
    return rest;
  },
  outboundState => {
    if (!outboundState || typeof outboundState !== 'object') return outboundState;
    return { ...outboundState, quotationFilterOptions: [] };
  },
  { whitelist: ['quotation'] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'lead', 'quotation'],
  transforms: [quotationFilterOptionsTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persister = persistStore(store);

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
