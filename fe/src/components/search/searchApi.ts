import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../../utils/sendRequest";
import { ISearchPayload, ISearchResponse } from "../../types/search";

const BASE_URL = 'http://localhost:8000';

export const searchRequest = createAsyncThunk<ISearchResponse, ISearchPayload>(
    "api/search",
    async (searchPayload, thunkApi) => {
        const res  = await sendRequest(`${BASE_URL}/movies`, {
            payload: searchPayload,
            thunkApi,
            method: 'GET',
        });
        return res;
    }
); 