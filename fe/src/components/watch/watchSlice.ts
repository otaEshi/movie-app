import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IUserInfoResponse } from '../../types/auth';
import { IMovie, ITrendingMoviesResponse } from '../../types/movies';
import { getMovieRequest } from './watchApi';

// Try to load user info from local storage


interface WatchState {
    movie: IMovie
}

const initialState: WatchState = {
    movie:
        {
            id: -1,
            title: '',
            description: '',
            thumbnail_url: '',
            url: '',
            genre: '',
            subgenre: '',
            source: '',
            views: 0,
            date_of_release: '',
            is_deleted: false,
            average_rating: 0,
            num_ratings: 0,
        }
};

const watchSlice = createSlice({
    name: 'watch',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getMovieRequest.fulfilled, (state, action) => {
                state.movie = action.payload
            })
    }
});

export default watchSlice.reducer;