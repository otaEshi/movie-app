import { createSlice } from '@reduxjs/toolkit';
import { IMovieList } from '../../types/movieList';
import { getDetailMovieList } from './movieListApi';

// Try to load user info from local storage


interface DetailMovieListState {
    detaiMovieList: IMovieList
}

const initialState: DetailMovieListState = {
    detaiMovieList: {
        name: '',
        description: '',
        create_at: '',
        owner_id: -1,
        id: -1,
        movies: [
            {
                id: -1,
                title: 'strng',
                description: '',
                thumbnail_url: '',
                url: '',
                genre: '',
                subgenre: '',
                source: '',
                views: 0,
                date_of_release: '',
                is_deleted: false,
                average_rating: 0,
                num_ratings:0,
            }
        ]

    }
};

const detailMovieListSlice = createSlice({
    name: 'detailMovieList',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getDetailMovieList.fulfilled, (state, action) => {
                state.detaiMovieList = action.payload;
                console.log('dispatch fullfill')
            })
    }
});

export default detailMovieListSlice.reducer;