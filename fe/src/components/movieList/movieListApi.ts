import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { IListMovieList, IMovieList, IMovieListPublic, IUpdateMovieList, IUpdateMovieListResponse } from "../../types/movieList";
import { ICreateMovieListPayload, ICreateMovieListResponse } from "../../types/movies";

const BASE_URL = 'http://localhost:8000';

export const getDetailMovieList = createAsyncThunk<IMovieList, string>(
    "api/detail_movie_list/",
    async (movie_list_id, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movie_lists/${movie_list_id}`
            , {
                thunkApi,
                method: 'GET',
            });
        return res;
    }
);

export const getMovieListPublic = createAsyncThunk<IListMovieList, IMovieListPublic>(
    "api/movie_list_public/",
    async (movie_list_public, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movie_lists/public`
            , {
                payload: movie_list_public,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
);

export const getMovieList = createAsyncThunk<IListMovieList, IMovieListPublic>(
    "api/movie_list/",
    async (movie_list, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movie_lists`
            , {
                payload: movie_list,
                thunkApi,
                method: 'GET',
            });
        return res;
    }
);

export const delMovieList = createAsyncThunk<void, number>(
    "api/delete_movie_list/",
    async (movie_list_id, thunkApi) => {
        // const res  = await sendRequest(ITrendingMoviePayload.genre ? `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}&genre=${ITrendingMoviePayload.genre}` : `${BASE_URL}/movies/top_trending?top_k=${ITrendingMoviePayload.top_k}`
        const res = await sendRequest(`${BASE_URL}/movie_lists/${movie_list_id}`
            , {
                thunkApi,
                method: 'DELETE',
            });
        return res;
    }
);

export const createMovieList = createAsyncThunk<ICreateMovieListResponse, ICreateMovieListPayload>(
    "api/create_movie_list/",
    async (movie_list_info, thunkApi) => {
        const res = await sendRequest(`${BASE_URL}/movie_lists`
            , {
                payload: movie_list_info,
                thunkApi,
                method: 'POST',
            });
        return res;
    }
);

export const updateMovieList = createAsyncThunk<IUpdateMovieListResponse, IUpdateMovieList>(
    "api/update_movie_list/",
    async (movie_list_info, thunkApi) => {
        const res = await sendRequest(`${BASE_URL}/movie_lists/${movie_list_info.id}`
            , {
                payload: {
                    movie_list: {
                        name: movie_list_info.name,
                        description: movie_list_info.description,
                        is_deleted: movie_list_info.is_deleted,
                    },
                    movie_ids: movie_list_info.movies,
                },
                thunkApi,
                method: 'PATCH',
            });
        return res;
    }
);

