import { configureStore } from '@reduxjs/toolkit';
import favoriteMoviesReducer from './reducer.js';

const store = configureStore({
  reducer: {
    favoriteMovies: favoriteMoviesReducer,
  },
});

export default store;