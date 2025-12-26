import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cityReducer from './citySlice.js';
import langReducer from './langSlice.js';
export const rootReducer = combineReducers({
    city: cityReducer,
    lang: langReducer
});
const store = configureStore({
    reducer: rootReducer
});
export { store };