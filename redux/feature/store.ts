import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
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
  userGroup:userGroupReducer
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === 'auth/logout') {
    storage.removeItem('persist:root');
    storage.removeItem('persist:auth');
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'lead', 'quotation'],
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
