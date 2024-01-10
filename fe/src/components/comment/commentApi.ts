import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { IComment, ICommentList, ICreateCommentPayload, IDeleteCommentPayload, IGetCommentPayload, IUpdateCommentPayload } from "../../types/comment";

const BASE_URL = 'http://localhost:8000';

export const getCommentRequest = createAsyncThunk<ICommentList, IGetCommentPayload>(
    "api/get_comment",
    async (commentPayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/${commentPayload.movie_id}/comments?page=${commentPayload.page}&page_size=${commentPayload.page_size}`, {
            // payload: commentPayload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 
export const createCommentRequest = createAsyncThunk<IComment, ICreateCommentPayload>(
    "api/create_comment",
    async (commentPayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/${commentPayload.movie_id}/comments?comment=${commentPayload.comment}`, {
            // payload: commentPayload,
            thunkApi,
            method: 'POST',
        });
        return res;
    }
); 
export const updateCommentRequest = createAsyncThunk<IComment, IUpdateCommentPayload>(
    "api/update_comment",
    async (commentPayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies/{movie_id}/comments?movie_comment_id=${commentPayload.movie_comment_id}&comment=${commentPayload.comment}&is_deleted=${commentPayload.is_deleted}`, {
            // payload: commentPayload,
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 
export const deleteCommentRequest = createAsyncThunk<void, IDeleteCommentPayload>(
    "api/delete_comment",
    async (commentPayload, thunkApi) => {
        localStorage.setItem('deleting_comment_id', commentPayload.movie_comment_id.toString())
        const res  = await sendRequest(`${BASE_URL}/movies/{movie_id}/comments?movie_comment_id=${commentPayload.movie_comment_id}`, {
            // payload: commentPayload,
            thunkApi,
            method: 'DELETE',
        });
        return res;
    }
); 