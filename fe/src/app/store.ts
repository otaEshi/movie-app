import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import authSlice from '../components/auth/authSlice';
import homeSlice from '../components/homes/homeSlice';

export const store = configureStore({
  reducer: {
    auth:authSlice,
    home:homeSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
