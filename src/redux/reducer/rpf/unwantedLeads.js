import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload a file
export const uploadUnwantedLeads = createAsyncThunk(
    'unwantedLeadsFileUpload/uploadEMMaster', // Naming consistency
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`

                },
            };
            const response = await axios.post(`${baseUrl}user/unwantedLeadsCsvFile`, formData, config);
            return response.data; // Return the response data
        } catch (error) {
            // Check if error.response is available, if not fallback to error.message
            return thunkAPI.rejectWithValue(error.response || error.message);
        }
    }
);

// Slice to handle upload states
const unwantedLeadsFileUploadSlice = createSlice({
    name: 'unwantedLeadsFileUpload', // Naming consistency
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
            .addCase(uploadUnwantedLeads.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadUnwantedLeads.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(uploadUnwantedLeads.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload; // Capture any error messages from the rejected action
            });
    },
});

// Export the actions and reducer
export const { resetUploadState } = unwantedLeadsFileUploadSlice.actions;
export default unwantedLeadsFileUploadSlice.reducer;