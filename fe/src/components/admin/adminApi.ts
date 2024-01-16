import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ICreateMoviePayload, IUpdateMoviePayload } from "../../types/movies";
import { IAdjustUserPermissionPayload, IGetAllUserPayload, IListMovieRatingPerGenre, IListMovieViewPerGenre, IMovieInTopList, IMovieViewPerGenre, ITopListPayload, ITopListed, IUpdateUserActivePayload, IUserList } from "../../types/admin";
import { IUserInfoResponse } from "../../types/auth";

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
    "api/update_movie/",
    async (update_movie_info, thunkApi) => {
        const res = await sendRequest(`${BASE_URL}/movies/thumbnail_url/${update_movie_info.id}`
            , {
                payload: {
                    title : update_movie_info.title,
                    description : update_movie_info.description,
                    date_of_release : update_movie_info.date_of_release,
                    url : update_movie_info.url,
                    genre : update_movie_info.genre,
                    subgenre : update_movie_info.subgenre,
                    source : update_movie_info.source,
                    thumbnail_url: update_movie_info.thumbnail_url,
                    is_deleted : update_movie_info.is_deleted,
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

// User
export const getAllUserRequest = createAsyncThunk<IUserList, IGetAllUserPayload>(
    "api/get_all_user",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users`, {
            payload: payload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 

// export const getUserRequest = createAsyncThunk<IUserInfoResponse, number>(
//     "api/get_one_user",
//     async (payload, thunkApi) => {
//         const res  = await sendRequest(`${BASE_URL}/user/${payload}`, {
//             thunkApi,
//             method: 'GET',
//         });
//         return res;
//     }
// ); 

export const getAllAdminRequest = createAsyncThunk<IUserList, IGetAllUserPayload>(
    "api/get_all_admin",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users`, {
            payload: payload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 

export const adjustUserPermissionRequest = createAsyncThunk<IUserInfoResponse, IAdjustUserPermissionPayload>(
    "api/user_permission",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/permissions?user_id=${payload.user_id}&is_content_admin=${payload.is_content_admin}`, {
            // payload: payload,
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 

export const updateUserActive = createAsyncThunk<IUserInfoResponse, IUpdateUserActivePayload>(
    "api/delete_user",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/active?user_id=${payload.user_id}&is_active=${payload.is_active}`, {
            // payload: {
            //     user_id: payload.user_id,
            //     is_active: payload.is_active,
            // },
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 

// Thống kê
export const moviesViewByGenreRequest = createAsyncThunk<IListMovieViewPerGenre, void>(
    "api/admin/movies_view_by_genre",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies_view_by_genre`, {
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 
export const moviesAvgRatingByGenreRequest = createAsyncThunk<IListMovieRatingPerGenre, void>(
    "api/admin/movies_avg_rating_by_genre",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies_avg_rating_by_genre`, {
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 
export const moviesViewBySubGenreRequest = createAsyncThunk<IListMovieViewPerGenre, void>(
    "api/admin/movies_view_by_subgenre",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies_view_by_subgenres`, {
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 
export const topListRequest = createAsyncThunk<IMovieInTopList[], ITopListPayload>(
    "api/admin/top_listed",
    async (payload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/top_listed`, {
            payload: payload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 