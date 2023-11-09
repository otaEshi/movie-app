import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ISignInPayload, ISignInResponse, ISignUpPayload } from "../../types/auth";

export const signUpRequest = createAsyncThunk<void, ISignUpPayload>(
    "api/sign-up",
    async (SignUpInfo, thunkApi) => {
        const res  = await sendRequest('/auth/register/', {
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
    const res = await sendRequest('/auth/signin/', {
      payload: signInInfo,
      thunkApi,
      method: 'POST',
    });
    return res;
  }
);