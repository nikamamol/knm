import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const ramasterupload = createAsyncThunk(
    'ramasterfileUpload/ramasterupload',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`,
                    // Removed Content-Type header for FormData
                },
            };
            const response = await axios.post(`${baseUrl}user/uploadramastercsv`, formData, config);
            return response.data;
        } catch (error) {
            console.error('File upload error:', error); // Log error
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
);

// Slice to handle upload states
const ramasterFileUploadSlice = createSlice({
    name: 'ramasterfileUpload',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetUploadState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(ramasterupload.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(ramasterupload.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(ramasterupload.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetUploadState } = ramasterFileUploadSlice.actions;
export default ramasterFileUploadSlice.reducer;