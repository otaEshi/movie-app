import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IUserInfoResponse } from '../../types/auth';
import { ITrendingMoviesResponse } from '../../types/movies';
import { topTrendingMoviesRequest } from './homeApi';

// Try to load user info from local storage


interface HomeState {
    trendingList: ITrendingMoviesResponse;
}

const initialState: HomeState = {
    trendingList: {
        movies: [
            {
                id: -1,
                title: 'strng',
                description: '',
                thumbnail_url: '',
                url: '',
                genre: '',
                subgenre: '',
                source: '',
                views: 0,
                date_of_release: '',
                is_deleted: false,
                globalRating: 0,
            }
        ]
    }
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(topTrendingMoviesRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    state.trendingList = action.payload;
                }
            })
    }
});

// export const { logout , setAvatarURL} = authSlice.actions;
export default homeSlice.reducer;