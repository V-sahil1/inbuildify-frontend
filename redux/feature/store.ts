import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth/authSlice';
import { leadReducer } from './lead/leadSlice';
import masterPriceListReducer from './masterPriceList/masterPriceListSlice';
import floorPlanReducer from './floorPlan/floorPlanSlice';
import facadeReducer from './facade/facadeSlice';
import packageReducer from './package/packageSlice';
import quotationReducer from './quotation/quotationSlice';
import { dashboardReducer } from './dashboard/dashboardSlice';
import typesReducer from './types/typesSlice';
import locationReducer from './location/locationSlice';
import contractorReducer from './contractor/contractorSlice';
import actionReducer from './action/actionSlice';
import userReducer from './user/userSlice';
import workflowReducer from './workflow/workflowSlice';
import colourReducer from './color/ColourSlice';
import taskReducer from './task/taskSlice';
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth', 'lead', 'quotation'],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  lead: leadReducer,
  masterPriceList: masterPriceListReducer,
  floorPlan: floorPlanReducer,
  facade: facadeReducer,
  package: packageReducer,
  quotation: quotationReducer,
  dashboard: dashboardReducer,
  types: typesReducer,
  location: locationReducer,
  contractor: contractorReducer,
  action: actionReducer,
  user: userReducer,
  workflow: workflowReducer,
  colour: colourReducer,
  task: taskReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
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
  blacklist: [
    'lead',
    'masterPriceList',
    'floorPlan',
    'facade',
    'dashboard',
    'package',
    'types',
    'location',
    'contractor',
    'action',
    'user',
    'workflow',
    'colour',
    'task',
  ],
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
