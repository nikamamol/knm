import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const qualitycheckedupload = createAsyncThunk(
    'qualitycheckedfileUpload/qualitycheckedupload',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Ensure multipart for FormData
                },
            };
            const response = await axios.post(`${baseUrl}user/uploadQualityCheckedCsvFile`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
);

// Slice to handle upload states
const qualitycheckedFileUploadSlice = createSlice({
    name: 'qualitycheckedfileUpload',
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
            .addCase(qualitycheckedupload.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(qualitycheckedupload.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(qualitycheckedupload.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetUploadState } = qualitycheckedFileUploadSlice.actions;
export default qualitycheckedFileUploadSlice.reducer;