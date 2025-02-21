import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const uploadEMMaster = createAsyncThunk(
    'emmasterFileUpload/uploadEMMaster',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`,
                    // Do not set "Content-Type" manually, Axios will handle it.
                },
            };
            const response = await axios.post(`${baseUrl}user/uploadEMMasterCsvFile`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response || error.message);
        }
    }
);

// Slice to handle upload states
const emmasterFileUploadSlice = createSlice({
    name: 'emmasterFileUpload', // Ensure the naming convention is consistent
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
            .addCase(uploadEMMaster.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadEMMaster.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(uploadEMMaster.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload; // Capture any error messages from the rejected action
            });
    },
});

// Export the actions and reducer
export const { resetUploadState } = emmasterFileUploadSlice.actions;
export default emmasterFileUploadSlice.reducer;