import { createSlice } from '@reduxjs/toolkit';
import { IListMovieList, IMovieList } from '../../types/movieList';
import { ISearchResponse } from '../../types/search';
import { searchRequest } from './searchApi';

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
            
    }
});

export default searchSlice.reducer;