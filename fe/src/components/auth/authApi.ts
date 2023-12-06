import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ISignInPayload, ISignInResponse, ISignUpPayload } from "../../types/auth";

const BASE_URL = 'http://localhost:8000';

export const signUpRequest = createAsyncThunk<void, ISignUpPayload>(
    "api/sign-up",
    async (SignUpInfo, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/signup/`, {
            payload: SignUpInfo,
            thunkApi,
            method: 'POST',
        });
        console.log('sign-up info: ', SignUpInfo);
        console.log('Sign-up response:', res);
        return res;
    }
); 
export const signInRequest = createAsyncThunk<ISignInResponse, ISignInPayload>(
  "api/signin",
  async (signInInfo, thunkApi) => {
    const res = await sendRequest(`${BASE_URL}/login/`, {
      payload: signInInfo,
      thunkApi,
      method: 'POST',
      headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    });
    return res;
  }
);