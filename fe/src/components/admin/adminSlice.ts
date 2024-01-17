import { createSlice } from '@reduxjs/toolkit';
import { IListMovieRatingPerGenre, IListMovieViewPerGenre, IMovieInTopList, IMovieRatingPerGenre, IMovieViewPerGenre, ITopListed, IUserList } from '../../types/admin';
import { IUserInfoResponse } from '../../types/auth';
import { adjustUserPermissionRequest, getAllAdminRequest, getAllNormalUserRequest, getAllUserRequest, getDeletedRequest, moviesAvgRatingByGenreRequest, moviesViewByGenreRequest, moviesViewBySubGenreRequest, restoreMovieRequest, topListRequest, updateUserActive } from './adminApi';
import { ISearchResponse } from '../../types/search';

interface AdminState {
    userList: IUserList;
    adminList: IUserList;
    normalUserList: IUserList;
    currentUser: IUserInfoResponse;
    listViewsByGenre: any;
    // listRatingsByGenre: IListMovieRatingPerGenre;
    listRatingsByGenre: any;
    // listViewsBySubgenre: IListMovieViewPerGenre;
    listViewsBySubgenre: any;
    // topListed: ITopListed;
    topListed: IMovieInTopList[];
    deletedMovieList: ISearchResponse
}

const initialState: AdminState = {
    userList:
    {
        list: [] as IUserInfoResponse[],
        max_page: 0,
    },
    adminList:
    {
        list: [] as IUserInfoResponse[],
        max_page: 0,
    },
    currentUser: {} as IUserInfoResponse,
    listViewsByGenre: [],
    listRatingsByGenre: {
        list: [] as IMovieRatingPerGenre[],
    },
    listViewsBySubgenre: {
        list: [] as IMovieViewPerGenre[],
    },
    topListed : [],
    normalUserList: {
        list: [] as IUserInfoResponse[],
        max_page: 0,
    },
    deletedMovieList : {
        list: [],
        max_page : 0
    }
};

const adminSlice = createSlice({
    name: 'Admin',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getAllUserRequest.fulfilled, (state, action) => {
                state.userList = action.payload;
            })
            .addCase(getAllAdminRequest.fulfilled, (state, action) => {
                state.adminList = action.payload;
            })
            .addCase(adjustUserPermissionRequest.fulfilled, (state, action) => {
                if (action.payload.is_content_admin) {
                    state.userList.list = state.userList.list.filter((user) => user.id !== action.payload.id);
                    state.adminList.list.push(action.payload);
                } else if (!action.payload.is_content_admin) {
                    state.adminList.list = state.adminList.list.filter((user) => user.id !== action.payload.id);
                    state.userList.list.push(action.payload);
                }
            })
            .addCase(getDeletedRequest.fulfilled, (state, action) => {
                state.deletedMovieList = action.payload;
            })
            .addCase(restoreMovieRequest.fulfilled, (state, action) => {
                state.deletedMovieList.list = state.deletedMovieList.list.filter((movie) => movie.id !== action.payload.id);
            })
            // .addCase(getUserRequest.fulfilled, (state, action) => {
            //     state.currentUser = action.payload;
            // })
            // .addCase(deleteUserRequest.fulfilled, (state, action) => {
            //     state.userList.list = state.userList.list.filter((user) => user.id !== action.payload.id);
            // })
            .addCase(moviesViewByGenreRequest.fulfilled, (state, action) => {
                state.listViewsByGenre = action.payload;
            })
            .addCase(moviesAvgRatingByGenreRequest.fulfilled, (state, action) => {
                state.listRatingsByGenre = action.payload;
            })
            .addCase(moviesViewBySubGenreRequest.fulfilled, (state, action) => {
                state.listViewsBySubgenre = action.payload;
            })
            .addCase(topListRequest.fulfilled, (state, action) => {
                state.topListed = action.payload;
                console.log('state: ',state.topListed)
                console.log('action: ',action.payload)
            })
            .addCase(updateUserActive.fulfilled, (state, action) => {
                state.userList.list = state.userList.list.filter((user) => user.id !== action.payload.id);
                state.userList.list.push(action.payload);
            })
            .addCase(getAllNormalUserRequest.fulfilled, (state, action) => {
                state.normalUserList = action.payload;
            })
    }
});

export default adminSlice.reducer;