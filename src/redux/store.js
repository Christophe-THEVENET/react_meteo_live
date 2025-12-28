import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cityReducer from './citySlice.js';
import langReducer from './langSlice.js';

const persistConfig = {
    key: 'meteo-easy',
    storage,
    whitelist: ['city', 'lang'] // Persister city et lang
};

const rootReducer = combineReducers({
    city: cityReducer,
    lang: langReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
});

const persistor = persistStore(store);

export { store, persistor };
