import { createSlice } from '@reduxjs/toolkit';
import { IListMovieList, IMovieList } from '../../types/movieList';
import { ISearchResponse } from '../../types/search';
import { advancedSearchRequest, searchRequest } from './searchApi';
import { deleteMovieRequest } from '../admin/adminApi';

// Try to load user info from local storage

interface SearchState {
    search_list: ISearchResponse
}

const initialState: SearchState = {
    search_list : {
        list: [],
        max_page : 1
    }
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(searchRequest.fulfilled, (state, action) => {
                state.search_list = action.payload;
            })
            .addCase(advancedSearchRequest.fulfilled, (state, action) => {
                state.search_list = action.payload;
            })   
            .addCase(deleteMovieRequest.fulfilled, (state, action) => {
                const temp_id = localStorage.getItem('deleted_movie');
                const id = temp_id ? parseInt(temp_id, 10) : null;

                state.search_list.list = state.search_list.list.filter((movie) => movie.id !== id);
            })        
    }
});

export default searchSlice.reducer;