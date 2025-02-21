import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

export const uploadFile = createAsyncThunk(
    'fileUpload/uploadFile',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${baseUrl}user/uploadcsv`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState: {
        status: 'idle',
        message: '',
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload.message;
            });
    },
});

export default fileUploadSlice.reducer;