import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IUserInfoResponse } from '../../types/auth';
import { ITrendingMoviesResponse } from '../../types/movies';
import { topTrendingForGenreRequest, topTrendingMoviesRequest, topTrendingMoviesRequestForAdmin, topTrendingMusicRequest, topTrendingSportRequest, topTrendingTravelRequest } from './homeApi';
import { deleteMovieRequest, updateMovieRequest } from '../admin/adminApi';

// Try to load user info from local storage


interface HomeState {
    trendingListAll: ITrendingMoviesResponse;
    trendingListSport: ITrendingMoviesResponse;
    trendingListMusic: ITrendingMoviesResponse;
    trendingListTravel: ITrendingMoviesResponse;
    trendingListForGenre: ITrendingMoviesResponse;
    trendingListAllForAdmin: ITrendingMoviesResponse;
}

const initialState: HomeState = {
    trendingListAll: {
        movies: []
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
    ,
    trendingListAllForAdmin: {
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
                if (action.payload) {
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
            .addCase(topTrendingSportRequest.fulfilled, (state, action) => {
                state.trendingListSport = action.payload;
                if (state.trendingListSport) {
                    state.trendingListSport.movies = action.payload;
                }
            })
            .addCase(topTrendingMusicRequest.fulfilled, (state, action) => {
                state.trendingListMusic = action.payload;
                if (state.trendingListMusic) {
                    state.trendingListMusic.movies = action.payload;
                }
            })
            .addCase(topTrendingTravelRequest.fulfilled, (state, action) => {
                state.trendingListTravel = action.payload;
                if (state.trendingListTravel) {
                    state.trendingListTravel.movies = action.payload;
                }
            })
            .addCase(topTrendingForGenreRequest.fulfilled, (state, action) => {
                state.trendingListForGenre = action.payload;
                if (state.trendingListForGenre) {
                    state.trendingListForGenre.movies = action.payload;
                }
            })
            .addCase(topTrendingMoviesRequestForAdmin.fulfilled, (state, action) => {
                state.trendingListAllForAdmin = action.payload;
                if (state.trendingListAllForAdmin) {
                    state.trendingListAllForAdmin.movies = action.payload;
                }
            })
            // .addCase(updateMovieRequest.fulfilled, (state, action) => {
            //     if (state.trendingListAll && state.trendingListAll.movies) {
            //         const updatedMovie = action.payload; // Assuming the payload contains the updated movie

            //         state.trendingListAll.movies = state.trendingListAll.movies.map((movie) =>
            //             movie.id === updatedMovie.id ? updatedMovie : movie
            //         );
            //     }
            // })
            .addCase(deleteMovieRequest.fulfilled, (state, action) => {
                const temp_id = localStorage.getItem('deleted_movie');
                const id = temp_id ? parseInt(temp_id, 10) : null;

                if (state.trendingListAll && state.trendingListAll.movies) {
                    state.trendingListAll = {
                        ...state.trendingListAll,
                        movies: state.trendingListAll.movies.filter((movie) => movie.id !== id),
                    };
                }

                if (state.trendingListSport && state.trendingListSport.movies) {
                    state.trendingListSport = {
                        ...state.trendingListSport,
                        movies: state.trendingListSport.movies.filter((movie) => movie.id !== id),
                    };
                }

                if (state.trendingListMusic && state.trendingListMusic.movies) {
                    state.trendingListMusic = {
                        ...state.trendingListMusic,
                        movies: state.trendingListMusic.movies.filter((movie) => movie.id !== id),
                    };
                }

                if (state.trendingListTravel && state.trendingListTravel.movies) {
                    state.trendingListTravel = {
                        ...state.trendingListTravel,
                        movies: state.trendingListTravel.movies.filter((movie) => movie.id !== id),
                    };
                }
            })
            // .addCase(updateMovieRequest.fulfilled, (state, action) => {
            //     const { id, title, description, date_of_release, url, genre, subgenre, source, thumbnail_url, is_deleted } = action.payload;
            
            //     const index = state.trendingListAll.movies.findIndex(movie => movie.id === id);
            
            //     if (index !== -1) {
            //         state.trendingListAll = {
            //             ...state.trendingListAll,
            //             movies: state.trendingListAll.movies.map((movie, i) => i === index ? {
            //                 ...movie,
            //                 id,
            //                 title,
            //                 description,
            //                 date_of_release,
            //                 url,
            //                 genre,
            //                 subgenre,
            //                 source,
            //                 thumbnail_url,
            //                 is_deleted,
            //             } : movie),
            //         };
            //     }
            // })
            .addCase(updateMovieRequest.fulfilled, (state, action) => {
                const { id, title, description, date_of_release, url, genre, subgenre, source, thumbnail_url, is_deleted } = action.payload;

                const updateMovieInList = (list: ITrendingMoviesResponse, listKey: keyof HomeState) => {
                    const index = list.movies.findIndex(movie => movie.id === id);

                    if (index !== -1) {
                        state[listKey] = {
                            ...list,
                            movies: list.movies.map((movie, i) => i === index ? {
                                ...movie,
                                id,
                                title,
                                description,
                                date_of_release,
                                url,
                                genre,
                                subgenre,
                                source,
                                thumbnail_url,
                                is_deleted,
                            } : movie),
                        };
                    }
                };

                updateMovieInList(state.trendingListAll, 'trendingListAll');
                updateMovieInList(state.trendingListSport, 'trendingListSport');
                updateMovieInList(state.trendingListMusic, 'trendingListMusic');
                updateMovieInList(state.trendingListTravel, 'trendingListTravel');
            });
            
            
    }
});

export default homeSlice.reducer;