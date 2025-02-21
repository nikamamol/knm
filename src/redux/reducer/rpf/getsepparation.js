// src/store/suppressionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Function to get the token (You should define this according to your authentication method)
const getToken = () => localStorage.getItem('token'); // Adjust this to your actual token retrieval method

// Fetch suppression files
export const fetchSuppressionFiles = createAsyncThunk(
    'suppressions/fetchSuppressionFiles',
    async () => {
        const response = await axios.get(`${baseUrl}user/getCsvFilesByseppression`);
        return response.data.files; // Return the files array from the response
    }
);

// Download file
export const downloadFile = createAsyncThunk(
    "suppressions/downloadFile",
    async ({ fileId, filename }, { rejectWithValue }) => {
        try {
            const token = getToken(); // Retrieve the JWT token
            const response = await axios.get(
                `${baseUrl}user/getSeparationCsvFileById/${fileId}`, {
                    responseType: "blob", // Receive the file as a Blob
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the header
                    },
                }
            );

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Return the Blob and the desired filename
            return { blob, filename: filename || 'download.csv' };
        } catch (error) {
            return rejectWithValue(error.response || error.message);
        }
    }
);

export const deleteFile = createAsyncThunk(
    "suppressions/deleteFile",
    async (fileId, { rejectWithValue }) => {
        try {
            const token = getToken();
            const response = await axios.delete(
                `${baseUrl}user/deleteSeparationCsvFileById/${fileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Correctly formatted Authorization header
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

const suppressionsSlice = createSlice({
    name: 'suppressions',
    initialState: {
        files: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppressionFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuppressionFiles.fulfilled, (state, action) => {
                state.loading = false;
                state.files = action.payload; // Set the fetched files
            })
            .addCase(fetchSuppressionFiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Handle error
            })
            .addCase(downloadFile.fulfilled, (state, action) => {
                // Create a blob URL
                const url = window.URL.createObjectURL(new Blob([action.payload.blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = action.payload.filename; // Use the original filename
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // Cleanup the URL object
            })
            .addCase(deleteFile.pending, (state) => {
                state.loading = true; // Adjust status for loading
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.loading = false; // Adjust status for loading
                state.files = state.files.filter(
                    (file) => file._id !== action.meta.arg
                );
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.loading = false; // Adjust status for loading
                state.error = action.payload || action.error.message;
            });
    },
});

export default suppressionsSlice.reducer;
