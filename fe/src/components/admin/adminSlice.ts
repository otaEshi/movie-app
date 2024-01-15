import { createSlice } from '@reduxjs/toolkit';
import { IListMovieRatingPerGenre, IListMovieViewPerGenre, IMovieInTopList, IMovieRatingPerGenre, IMovieViewPerGenre, ITopListed, IUserList } from '../../types/admin';
import { IUserInfoResponse } from '../../types/auth';
import { adjustUserPermissionRequest, getAllAdminRequest, getAllUserRequest, moviesAvgRatingByGenreRequest, moviesViewByGenreRequest, moviesViewBySubGenreRequest, topListRequest } from './adminApi';

interface AdminState {
    userList: IUserList;
    adminList: IUserList;
    currentUser: IUserInfoResponse;
    listViewsByGenre: any;
    // listRatingsByGenre: IListMovieRatingPerGenre;
    listRatingsByGenre: any;
    // listViewsBySubgenre: IListMovieViewPerGenre;
    listViewsBySubgenre: any;
    // topListed: ITopListed;
    topListed: IMovieInTopList[];
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
    }
});

export default adminSlice.reducer;