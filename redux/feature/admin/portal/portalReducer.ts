import { combineReducers } from '@reduxjs/toolkit';
import customerPortalReducer from './customerPortal/customerPortalSlice';

export const portalReducer = combineReducers({
  customerPortal: customerPortalReducer, 
});
