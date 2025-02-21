// rfpSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Thunk to fetch files from the API
export const fetchFiles = createAsyncThunk('rfp/fetchFiles', async(_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseUrl}user/getCsvDatabyOperationAll`, {
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.files;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});

const getToken = () => {
    const token = localStorage.getItem('authToken');
    // Log the token for debugging
    return token;
};

export const readFile = createAsyncThunk(
    'rfp/readFile',
    async({ fileId }, { rejectWithValue }) => {
        try {
            const token = getToken(); // Get the token
            const response = await axios.get(`${baseUrl}user/getCsvFileByIdOperation/${fileId}`, {
                responseType: 'arraybuffer', // Change to 'arraybuffer' for reading the file
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token in the Authorization header
                },
            });

            // Ensure the response contains data
            if (!response.data) {
                throw new Error('No data received from the server');
            }

            // Return the arrayBuffer
            return { buffer: response.data };
        } catch (error) {
            console.error('Error fetching file:', error); // Log error for debugging
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
const rfpSlice = createSlice({
    name: 'rfp',
    initialState: {
        files: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(readFile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(readFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Handle file data here if needed
            })
            .addCase(readFile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    },
});

export default rfpSlice.reducer;