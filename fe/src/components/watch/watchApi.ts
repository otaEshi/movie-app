import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { IMovie, IMovieRequest } from "../../types/movies";

const BASE_URL = 'http://localhost:8000';

export const getMovieRequest = createAsyncThunk<IMovie, string>(
    "api/get_movie",
    async (movie_id, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/${movie_id}`, {
            // payload: movie_id,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 

export const updateMovieViewRequest = createAsyncThunk<IMovie, string>(
    "api/update_view",
    async (movie_id, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/register_view/${movie_id}`, {
            // payload: movie_id,
            thunkApi,
            method: 'POST',
        });
        return res;
    }
); 
