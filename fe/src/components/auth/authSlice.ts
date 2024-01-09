import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { signInRequest, signUpRequest, userInfoRequest } from './authApi';
import { IUserInfoResponse } from '../../types/auth';

// Try to load user info from local storage
let access_token = localStorage.getItem('access_token');
let userId = null;
let isAuthenticated = Boolean(access_token);

if (access_token) {
    try {
        let tokenDecode: any = jwtDecode(access_token);
        if (tokenDecode) {
            userId = tokenDecode['user_id'];
        }
    } catch (error) {
        isAuthenticated = false;
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
    }

}

interface AuthState {
    // currentUser: {
    //     id: number,
    //     name: string,
    //     email: string,
    //     username: string,
    //     password: string,
    //     date_of_birth: string,
    //     movie_lists: string[],
    //     is_active: boolean,
    //     is_admin: boolean,
    //     is_content_admin: boolean,
    //     avatar_url: string,
    // }
    currentUser: IUserInfoResponse
}


const initialState: AuthState = {
    currentUser: {
        id: userId,
        name: "",
        email: "",
        username: "",
        password: "",
        date_of_birth: "",
        is_active: false,
        is_admin: false,
        is_content_admin: false,
        avatar_url: "",
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        logout: state => {
            localStorage.setItem('isAuthenticated', JSON.stringify(false));
            localStorage.removeItem('access_token');
            localStorage.removeItem('avatar_url');
            localStorage.removeItem('token_type');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('is_refresh_page');
            window.location.reload();
        },

        setAvatarURL: (state, action) => {
            state.currentUser.avatar_url = action.payload;
        }

    },
    extraReducers: builder => {
        builder
            .addCase(signInRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    localStorage.setItem('access_token', action.payload.access_token);
                    localStorage.setItem('refresh_token', action.payload.refresh_token);
                    localStorage.setItem('token_type', action.payload.token_type);
                    // axios.defaults.headers.common['Authorization'] = action.payload.token_type + ' ' + action.payload.access_token;
                    localStorage.setItem('isAuthenticated', JSON.stringify(true));
                    window.location.reload();
                }
            })
            .addCase(signUpRequest.fulfilled, (state, action) => {
                // if (action.payload) {
                //     localStorage.setItem('isAuthenticated', JSON.stringify(true));
                // }
            })
            // .addCase()
            .addCase(userInfoRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    // localStorage.setItem('avatar_url', action.payload.avatar_url);
                    // localStorage.setItem('currentUser',) 
                    state.currentUser = action.payload;
                    localStorage.setItem('is_refresh_page', 'true');
                }
            });
    }
});

export const { logout , setAvatarURL} = authSlice.actions;
export default authSlice.reducer;