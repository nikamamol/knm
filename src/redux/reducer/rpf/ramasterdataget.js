// src/redux/reducer/rpf/raMasterFileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';
const getToken = () => localStorage.getItem("authToken");

// Thunk to fetch data
export const fetchAllraMasterFile = createAsyncThunk(
    'fetchRaFileData/fetchAllraMasterFile',
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseUrl}user/getramasterCsvFileData`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.files; // Ensure 'files' matches backend response
        } catch (error) {
            console.error('Error fetching files:', error);
            return rejectWithValue(error.response ? error.response.data : 'An error occurred');
        }
    }
);

export const downloadFileByRaMaster = createAsyncThunk(
    "fileData/downloadExcelFile",
    async({ fileId, filename }, { rejectWithValue }) => {
        try {
            const token = getToken(); // Retrieve the JWT token
            console.log(
                `Starting Excel file download: ${filename} with fileId: ${fileId}`
            );

            const response = await axios.get(
                `${baseUrl}user/getramasterCsvFileData/${fileId}`, {
                    responseType: "blob", // Receive the file as a Blob
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the header
                    },
                }
            );

            console.log("Excel file download response received:", response);

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); // Set the filename for download

            // Append the link to the document body and trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up by removing the link and revoking the Object URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { fileId, filename };
        } catch (error) {
            console.error("Error during Excel file download:", error);
            return rejectWithValue(error.response || error.message);
        }
    }
);

export const deleteRaMasterFile = createAsyncThunk(
    'raMaster/deleteFile',
    async(fileId) => {
        const token = localStorage.getItem('authToken');

        const headers = {
            Authorization: `Bearer ${token}`, // Correctly include the token
        };

        const response = await axios.delete(`${baseUrl}user/deleteRaMasterCsvFileById/${fileId}`, { headers });
        return response.data;
    }
);

const raMasterFileSlice = createSlice({
    name: 'raFileUpload',
    initialState: {
        files: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllraMasterFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllraMasterFile.fulfilled, (state, action) => {
                state.loading = false;
                state.files = action.payload;
            })
            .addCase(fetchAllraMasterFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(downloadFileByRaMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadFileByRaMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFile = action.payload; // Store the selected file
            })
            .addCase(downloadFileByRaMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteRaMasterFile.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRaMasterFile.fulfilled, (state, action) => {
                state.loading = false;
                state.files = state.files.filter((file) => file._id !== action.payload.id); // Update files state
            })
            .addCase(deleteRaMasterFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the async thunk and the reducer
export default raMasterFileSlice.reducer;