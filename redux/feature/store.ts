import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./auth/authSlice";
import { leadReducer } from "./lead/leadSlice";
import masterPriceListReducer from "./masterPriceList/masterPriceListSlice";
import floorPlanReducer from "./floorPlan/floorPlanSlice";
import facadeReducer from "./facade/facadeSlice";
import packageReducer from "./package/packageSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth", "lead"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  lead: leadReducer,
  masterPriceList: masterPriceListReducer,
  floorPlan: floorPlanReducer,
  facade: facadeReducer,
  package: packageReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["lead", "masterPriceList", "floorPlan", "facade"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
