import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ITrendingMoviesPayload, ITrendingMoviesResponse } from "../../types/movies";

const BASE_URL = 'http://localhost:8000';

export const topTrendingMoviesRequest = createAsyncThunk<ITrendingMoviesResponse, ITrendingMoviesPayload>(
    "api/movies/top_trending",
    async (ITrendingMoviePayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}`, {
            payload: ITrendingMoviePayload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 