import { createSlice } from '@reduxjs/toolkit';
import { IComment, ICommentList } from '../../types/comment';
import { createCommentRequest, deleteCommentRequest, getCommentRequest, updateCommentRequest } from './commentApi';

// Try to load user info from local storage


interface CommentState {
    comment_list: ICommentList,
    // max_page : number
}

const initialState: CommentState = {
    comment_list: {
        list: [],
        max_page: 1
    }
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getCommentRequest.fulfilled, (state, action) => {
                state.comment_list = action.payload;
            })
            .addCase(createCommentRequest.fulfilled, (state, action) => {
                state.comment_list.list.push(action.payload);
            })
            .addCase(updateCommentRequest.fulfilled, (state, action) => {
                const indexToUpdate = state.comment_list.list.findIndex(item => item.id === action.payload.id);
                if (indexToUpdate !== -1) {
                    state.comment_list.list[indexToUpdate] = action.payload;
                }
            })
            .addCase(deleteCommentRequest.fulfilled, (state, action) => {
                const deleting_comment_id: number | null = parseInt(localStorage.getItem('deleting_comment_id') || '-1', 10);

                if (deleting_comment_id !== null) {
                    state.comment_list.list = state.comment_list.list.filter(item => item.id !== deleting_comment_id);
                }
            })



    }
});

export default commentSlice.reducer;