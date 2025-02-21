// Redux Slice (operationMasterCsvFile slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const uploadOpMaster = createAsyncThunk(
    'opmasterFileUpload/uploadOpMaster',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`

                },
            };
            const response = await axios.post(`${baseUrl}user/operationMasterCsvFile`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response || error.message);
        }
    }
);

// Slice to handle upload states
const opmasterFileUploadSlice = createSlice({
    name: 'opmasterFileUpload',
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
            .addCase(uploadOpMaster.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadOpMaster.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(uploadOpMaster.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

// Export the actions and reducer
export const { resetUploadState } = opmasterFileUploadSlice.actions;
export default opmasterFileUploadSlice.reducer;