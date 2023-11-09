import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { signInRequest } from './authApi';

// Try to load user info from local storage
let id_token = localStorage.getItem('id_token');
let refresh_token = localStorage.getItem('refresh_token');
let roleId = null;
let userId = null;
let isAuthenticated = Boolean(id_token && refresh_token);
if (id_token) {
    try {
        let tokenDecode: any = jwtDecode(id_token);
        if (tokenDecode) {
            roleId = tokenDecode['role_id'];
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
        roleId: number
    }
}


const initialState: AuthState = {
    // TODO: Change this to required login
    isAuthenticated: isAuthenticated,
    currentUser: {
        id: userId,
        roleId: roleId,
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
        },

    },
    extraReducers: builder => {
        builder.addCase(signInRequest.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                localStorage.setItem('id_token', action.payload.access_token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
                axios.defaults.headers.common['Authorization'] = "Bearer " + action.payload.access_token;
            }
        });

    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;