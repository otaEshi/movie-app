import { createAsyncThunk } from "@reduxjs/toolkit";
import { IChangePassword, IUpdatePayload } from "../../types/profile";
import { sendRequest } from "../../utils/sendRequest";

const BASE_URL = 'http://localhost:8000';     

export const updateUserInfoRequest= createAsyncThunk<string, IUpdatePayload>(
    "api/update_with_avatar",
    async (updateInfo, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/me?name=${updateInfo.name}&date_of_birth=${updateInfo.date_of_birth}`, {
            payload: {
                image_base64: updateInfo.avatar?.image_base64,
            },
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 

export const updateUserInfoRequestWithoutAvatar = createAsyncThunk<string, IUpdatePayload>(
    "api/update_with_avatar",
    async (updateInfo, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/users/me?name=${updateInfo.name}&date_of_birth=${updateInfo.date_of_birth}`, {
            thunkApi,
            method: 'PATCH',
        });
        return res;
    }
); 
// export const updateUserInfoRequest = createAsyncThunk<string, IUpdatePayload>(
//     "api/update_user_info",
//     async (updateInfo, thunkApi) => {
//         const formData = new FormData();

//         // Append non-file fields
//         updateInfo.name && formData.append('name', updateInfo.name);
//         updateInfo.date_of_birth && formData.append('date_of_birth', updateInfo.date_of_birth);

//         // Append file if available
//         if (updateInfo.avatar) {
//             formData.append('avatar', updateInfo.avatar);
//         }

//         const res = await sendRequest(`${BASE_URL}/users/me`, {
//             payload: formData,
//             thunkApi,
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         return res;
//     }
// );

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