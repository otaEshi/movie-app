import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { IFirstRatePayload, ITrendingMoviesPayload, ITrendingMoviesResponse, IUpdateRatingPayload } from "../../types/movies";

const BASE_URL = 'http://localhost:8000';

// export const topTrendingMoviesRequest = createAsyncThunk<ITrendingMoviesResponse, ITrendingMoviesPayload>(
export const topTrendingMoviesRequest = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_all",
    async (ITrendingMoviePayload, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: ITrendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const topTrendingMoviesRequestForAdmin = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_all_for_admin",
    async (ITrendingMoviePayload, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: ITrendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const topTrendingForGenreRequest = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_for_genre",
    async (ITrendingMoviePayload, thunkApi) => {
        console.log('dispatching')
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: ITrendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const topTrendingSportRequest = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_sport",
    async (ITrendingMoviePayload, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: ITrendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const topTrendingMusicRequest = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_music",
    async (ITrendingMoviePayload, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: ITrendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const topTrendingTravelRequest = createAsyncThunk<any, ITrendingMoviesPayload>(
    "api/movies/top_trending_travel",
    async (trendingMoviePayload, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/top_trending`
            , {
                payload: trendingMoviePayload,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
); 
export const firstRateMovie = createAsyncThunk<any, IFirstRatePayload>(
    "api/movies/first_time_rate",
    async (firstRate, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movies/${firstRate.movie_id}/ratings?rating=${firstRate.rating}`
            , {
                // payload: firstRate,
                thunkApi,
                method: 'POST',
            });
        return res;
    }
); 
export const updateRating = createAsyncThunk<any, IUpdateRatingPayload>(
    "api/movies/update_rating",
    async (updateRating, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(!updateRating.is_deleted ? `${BASE_URL}/movies/${updateRating.movie_id}/ratings?rating=${updateRating.rating}` : `${BASE_URL}/movies/${updateRating.movie_id}/ratings?raing=${updateRating.rating}&is_deleted=${updateRating.is_deleted}`
            , {
                // payload: updateRating,
                thunkApi,
                method: 'PATCH',
            });
        return res;
    }
); 