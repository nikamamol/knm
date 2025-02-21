import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk for fetching templates
export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async() => {
    try {
        const response = await axios.get(`${baseUrl}user/getTemplateData`);

        return response.data;
    } catch (error) {
        console.error('API Error:', error); // Add this line to debug
        throw error;
    }
});

const viewTemplateSlice = createSlice({
    name: 'templates',
    initialState: {
        templates: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templates = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default viewTemplateSlice.reducer;