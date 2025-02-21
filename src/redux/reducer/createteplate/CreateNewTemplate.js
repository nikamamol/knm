// src/redux/templateSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to handle the API call
export const createTemplate = createAsyncThunk(
    'template/createTemplate',
    async(formData, thunkAPI) => {
        try {
            const response = await axios.post(`${baseUrl}user/createTemplate`, formData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const templateSlice = createSlice({
    name: 'template',
    initialState: {
        loading: false,
        error: null,
        data: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default templateSlice.reducer;