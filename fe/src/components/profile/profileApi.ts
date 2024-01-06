import { createAsyncThunk } from "@reduxjs/toolkit";
import { IChangePassword, IUpdatePayload } from "../../types/profile";
import { sendRequest } from "../../utils/sendRequest";

const BASE_URL = 'http://localhost:8000';

export const updateUserInfoRequest = createAsyncThunk<string, IUpdatePayload>(
    "api/update",
    async (updateInfo, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/me?name=${updateInfo.name}%20&date_of_birth=${updateInfo.date_of_birth}`, {
            payload: updateInfo,
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 

export const changePasswordRequest = createAsyncThunk<string, IChangePassword>(
    "api/change_password",
    async (changePasswordInfo, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/me/change_password?old_password=${changePasswordInfo.old_password}&new_password=${changePasswordInfo.new_password}`, {
            payload: changePasswordInfo,
            thunkApi,
            method: 'POST',
        });
        return res;
    }
); 