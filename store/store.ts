// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
    user: userReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
