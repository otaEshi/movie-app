import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IUserInfoResponse } from '../../types/auth';
import { ITrendingMoviesResponse } from '../../types/movies';
import { topTrendingForGenreRequest, topTrendingMoviesRequest, topTrendingMusicRequest, topTrendingSportRequest, topTrendingTravelRequest } from './homeApi';

// Try to load user info from local storage


interface HomeState {
    trendingListAll: ITrendingMoviesResponse;
    trendingListSport: ITrendingMoviesResponse;
    trendingListMusic: ITrendingMoviesResponse;
    trendingListTravel: ITrendingMoviesResponse;
    trendingListForGenre: ITrendingMoviesResponse;
}

const initialState: HomeState = {
    trendingListAll: {
        movies: [ ]
    },
    trendingListSport: {
        movies: []
    }
    ,
    trendingListMusic: {
        movies: []
    }
    ,
    trendingListTravel: {
        movies: []
    }
    ,
    trendingListForGenre: {
        movies: []
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
                if (action.payload ) {
                    state.trendingListAll = action.payload;
                    if (state.trendingListAll) {
                        state.trendingListAll.movies = action.payload;
                        // console.log('get trending list all')
                    // } else if (state.trendingListType === 1 && state.trendingListSport) {
                    //     state.trendingListSport.movies = action.payload;
                    //     console.log('get trending list sport')
                    // } else if (state.trendingListType === 2 && state.trendingListMusic) {
                    //     state.trendingListMusic.movies = action.payload;
                    //     console.log('get trending list music')
                    // } else if (state.trendingListType === 3 && state.trendingListTravel) {
                    //     state.trendingListTravel.movies = action.payload;
                    //     console.log('get trending list travel')
                    }
                }
            })
            .addCase(topTrendingSportRequest.fulfilled, (state,action) => {
                state.trendingListSport = action.payload;
                if (state.trendingListSport) {
                    state.trendingListSport.movies = action.payload;
                }
            })
            .addCase(topTrendingMusicRequest.fulfilled, (state,action) => {
                state.trendingListMusic = action.payload;
                if (state.trendingListMusic) {
                    state.trendingListMusic.movies = action.payload;
                }
            })
            .addCase(topTrendingTravelRequest.fulfilled, (state,action) => {
                state.trendingListTravel = action.payload;
                if (state.trendingListTravel) {
                    state.trendingListTravel.movies = action.payload;
                }
            })
            .addCase(topTrendingForGenreRequest.fulfilled, (state,action) => {              
                state.trendingListForGenre = action.payload;
                if (state.trendingListForGenre) {
                    state.trendingListForGenre.movies = action.payload;
                }
            })
    }
});

export default homeSlice.reducer;