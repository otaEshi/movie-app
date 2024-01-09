import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import authSlice from '../components/auth/authSlice';
import homeSlice from '../components/homes/homeSlice';
import watchSlice from '../components/watch/watchSlice';
import detaiMovieListSlice from '../components/movieList/detaiMovieListSlice';
import movieListSlice from '../components/movieList/movieListSlice';
import searchSlice from '../components/search/searchSlice';

export const store = configureStore({
  reducer: {
    auth:authSlice,
    home:homeSlice,
    watch:watchSlice,
    detailMovieList:detaiMovieListSlice,
    movieList:movieListSlice,
    search:searchSlice,
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
