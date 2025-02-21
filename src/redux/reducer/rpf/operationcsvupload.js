import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to upload an operation file
export const uploadOperationFile = createAsyncThunk(
    'operationfileUpload/uploadOperationFile',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`

                },
            };
            const response = await axios.post(`${baseUrl}user/operationCsvFile`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to fetch CSV files by operation
export const fetchFiles = createAsyncThunk('operationfileUpload/fetchFiles', async(_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseUrl}user/getCsvDatabyOperation`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data.files;
    } catch (error) {
        return rejectWithValue(error.response || 'An error occurred');
    }
});
export const fetchFilesAll = createAsyncThunk(
    'operationfileUpload/fetchFilesAll',
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseUrl}user/getCsvDatabyOperationAll`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.files; // Ensure 'files' matches backend response
        } catch (error) {
            console.error('Error fetching files:', error);
            return rejectWithValue(error.response ? error.response.data : 'An error occurred');
        }
    }
);

// Initial state for the slice
const initialState = {
    files: [],
    status: 'idle',
    message: '',
    error: null,
};

// Create slice
const fileUploadSliceCsvByOperation = createSlice({
    name: 'operationfileUpload',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadOperationFile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadOperationFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(uploadOperationFile.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload.message;
            })
            .addCase(fetchFiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.files = action.payload;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchFilesAll.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilesAll.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.files = action.payload; // Payload contains the fetched files
            })
            .addCase(fetchFilesAll.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'An error occurred';
            });
    },
});

export default fileUploadSliceCsvByOperation.reducer;