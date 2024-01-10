import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ICreateMoviePayload } from "../../types/movies";

const BASE_URL = 'http://localhost:8000';

export const createMovieRequest = createAsyncThunk<void, ICreateMoviePayload>(
    "api/create_movie",
    async (createPayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/thumbnail_url`, {
            payload: createPayload,
            thunkApi,
            method: 'POST',
        });
        return res;
    }
); 