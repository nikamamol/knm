import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const uploadSuppression = createAsyncThunk(
    'suprressionFileUpload/uploadSuppression',
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${baseUrl}user/uploadSuppressionortalCsvFile`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice to handle upload states
const suprressionFileUploadSlice = createSlice({
    name: 'suprressionFileUpload',
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
            .addCase(uploadSuppression.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadSuppression.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(uploadSuppression.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetUploadState } = suprressionFileUploadSlice.actions;
export default suprressionFileUploadSlice.reducer;
