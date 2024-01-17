import { createSlice } from '@reduxjs/toolkit';
import { IListMovieList, IMovieList } from '../../types/movieList';
import { createMovieList, delMovieList, getDetailMovieList, getMovieList, getMovieListPublic, updateMovieList } from './movieListApi';
import { updateMovieRequest } from '../admin/adminApi';
import { ITrendingMoviesResponse } from '../../types/movies';

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
                    create_at: action.payload.create_at,
                    owner_id: action.payload.owner_id,
                    id: action.payload.id,
                    movies: [],
                } as IMovieList
                state.personal_list.list.push(tempList)
            })
            .addCase(updateMovieList.fulfilled, (state, action) => {
                const { id, name, description } = action.payload;

                const updatedList = state.personal_list.list.find(item => item.id === id);

                if (updatedList) {
                    // If the list with the same ID is found, update specific properties from the payload
                    updatedList.name = name;
                    updatedList.description = description;
                }
            })
            .addCase(updateMovieRequest.fulfilled, (state, action) => {
                const { id, title, description, date_of_release, url, genre, subgenre, source, thumbnail_url, is_deleted } = action.payload;
            
                state.public_list.list.map(list => {
                    list.movies.map(movie => {
                        if (movie.id === id) {
                            movie.title = title;
                            movie.description = description;
                            movie.date_of_release = date_of_release;
                            movie.url = url;
                            movie.genre = genre;
                            movie.subgenre = subgenre;
                            movie.source = source;
                            movie.thumbnail_url = thumbnail_url;
                            movie.is_deleted = is_deleted;
                        }
                    })
                })
            });
    }
});

export default movieListSlice.reducer;