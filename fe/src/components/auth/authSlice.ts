import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { signInRequest, signUpRequest, userInfoRequest } from './authApi';

// Try to load user info from local storage
let id_token = localStorage.getItem('id_token');
let refresh_token = localStorage.getItem('refresh_token');
let userId = null;
let isAuthenticated = Boolean(id_token && refresh_token);
if (id_token) {
    try {
        let tokenDecode: any = jwtDecode(id_token);
        if (tokenDecode) {
            userId = tokenDecode['user_id'];
        }
    } catch (error) {
        isAuthenticated = false;
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('refresh_token');
    }

}

interface AuthState {
    isAuthenticated: boolean,
    currentUser: {
        id: number,
        name: string,
        email: string,
        username: string,
        password: string,
        date_of_birth: string,
        movie_lists: string[],
        is_active: boolean,
        is_admin: boolean,
        is_content_admin: boolean,
        avatar_id: string,
    }
}


const initialState: AuthState = {
    isAuthenticated: isAuthenticated,
    currentUser: {
        id: userId,
        name: "",
        email: "",
        username: "",
        password: "",
        date_of_birth: "",
        movie_lists: [],
        is_active: false,
        is_admin: false,
        is_content_admin: false,
        avatar_id: "",
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        logout: state => {
            state.isAuthenticated = false;
            localStorage.removeItem('id_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('refresh_token');
            window.location.reload();
        },

    },
    extraReducers: builder => {
        builder
            .addCase(signInRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isAuthenticated = true;
                    localStorage.setItem('id_token', action.payload.access_token);
                    localStorage.setItem('refresh_token', action.payload.refresh_token);
                    axios.defaults.headers.common['Authorization'] = "Bearer " + action.payload.access_token;
                    window.location.reload();
                }
            })
            .addCase(signUpRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isAuthenticated = true;

                    // localStorage.setItem('id_token', action.payload.access_token);
                    // localStorage.setItem('refresh_token', action.payload.refresh_token);
                    // axios.defaults.headers.common['Authorization'] = "Bearer " + action.payload.access_token;
                }
            })
            .addCase(userInfoRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    localStorage.setItem('avatar_id', action.payload.avatar_id);
                    console.log("test1")
                    console.log("check: " + action.payload.avatar_id)
                    console.log("test2")
                }
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;