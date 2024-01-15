import { createSlice } from '@reduxjs/toolkit';
import { IListMovieList, IMovieList } from '../../types/movieList';
import { createMovieList, delMovieList, getDetailMovieList, getMovieList, getMovieListPublic, updateMovieList } from './movieListApi';

// Try to load user info from local storage


interface MovieListState {
    public_list: IListMovieList
    personal_list: IListMovieList
}

const initialState: MovieListState = {
    public_list: {
        list: [
            {
                name: '',
                description: '',
                create_at: '',
                id: -1,
                owner_id: -1,
                movies: [
                    {
                        id: -1,
                        title: '',
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
                        num_ratings: 0,
                    }
                ]
            }
        ]
        , max_page: 1
    },
    personal_list: {
        list: [
            {
                name: '',
                description: '',
                create_at: '',
                owner_id: -1,
                id: -1,
                movies: [
                    {
                        id: -1,
                        title: '',
                        description: '',
                        thumbnail_url: '',
                        url: '',
                        genre: '',
                        subgenre:'' ,
                        source: '',
                        views: 0,
                        date_of_release: '',
                        is_deleted: false,
                        average_rating: 0,
                        num_ratings: 0,
                    }
                ]
            }
        ]
        , max_page: 1
    }
};

const movieListSlice = createSlice({
    name: 'MovieList',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getMovieListPublic.fulfilled, (state, action) => {
                state.public_list = action.payload;
            })
            .addCase(getMovieList.fulfilled, (state, action) => {
                state.personal_list = action.payload
            })
            .addCase(delMovieList.fulfilled, (state, action) => {
                const deletedList = parseInt(localStorage.getItem('deleted_list') ?? '-1');
                state.personal_list.list = state.personal_list.list.filter(item => item.id !== deletedList);
                localStorage.removeItem('deleted_list');
            })
            // .addCase(updateMovieList.fulfilled, (state, action) => {
            //     state.personal_list.list.map(item => {
            //         if (item.id === action.payload.id) {
            //             return action.payload;
            //         }
            //         return item;
            //     });
            // })
            .addCase(createMovieList.fulfilled, (state, action) => {
                const tempList = {
                    name: action.payload.name,
                    description: action.payload.description,
                    create_at: '',
                    owner_id: -1,
                    id:  action.payload.id,
                    movies: [],
                } as IMovieList
                state.personal_list.list.push(tempList)
            })
    }
});

export default movieListSlice.reducer;