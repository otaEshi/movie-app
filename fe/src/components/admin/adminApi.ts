import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ICreateMoviePayload, IUpdateMoviePayload } from "../../types/movies";

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

export const updateMovieRequest = createAsyncThunk<void, IUpdateMoviePayload>(
    "api/update_movie_list/",
    async (update_movie_info, thunkApi) => {
        const res = await sendRequest(`${BASE_URL}/movies/${update_movie_info.id}`
            , {
                payload: {
                    title : update_movie_info.title,
                    description : update_movie_info.description,
                    date_of_release : update_movie_info.date_of_release,
                    url : update_movie_info.url,
                    genre : update_movie_info.genre,
                    source : update_movie_info.source,
                    is_deleted : update_movie_info.is_deleted,
                    // subgenre : update_movie_info.subgenre,

                },
                thunkApi,
                method: 'PATCH',
            });
        return res;
    }
);

export const deleteMovieRequest = createAsyncThunk<void, number>(
    "api/delete_movie",
    async (id, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/${id}`, {
            thunkApi,
            method: 'DELETE',
        });
        return res;
    }
); 