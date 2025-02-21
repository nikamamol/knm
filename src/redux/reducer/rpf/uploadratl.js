import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Upload RAT L File
export const uploadRatLFile = createAsyncThunk(
    'fileUpload/uploadRatLFile',
    async(formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${baseUrl}user/uploadratl`, formData, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "Upload failed");
        }
    }
);

// Get RAT L CSV Files
export const getRatLCsvFiles = createAsyncThunk(
    'fileUpload/getRatLCsvFiles',
    async(_, thunkAPI) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${baseUrl}user/getratlcsvfile`, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "Fetching files failed");
        }
    }
);

// Update File Status (Quality)
export const updateFileStatusQuality = createAsyncThunk(
    'fileUpload/updateFileStatusQuality',
    async({ fileId, checked }, { getState, rejectWithValue }) => {
        try {
            // Get the files from the Redux state
            const { ratlFiles } = getState().fileUpload;
            const fileToUpdate = ratlFiles.find((file) => file._id === fileId);

            if (!fileToUpdate) {
                throw new Error("File not found");
            }

            // Update the "Quality" status based on the checkbox checked value
            const updatedStatus = fileToUpdate.status.map((status) =>
                status.userType === "Quality" ? {...status, checked } : status
            );

            // Make the API call to update the status in the backend
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `${baseUrl}user/updateStatus_rl_tl/${fileId}`, { status: updatedStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data; // Return the updated file data to be handled by the reducer
        } catch (error) {
            return rejectWithValue(error.response.data || error.message);
        }
    }
);




// Update File Status (Email)
export const updateFileStatusEmail = createAsyncThunk(
    'fileUpload/updateFileStatusEmail',
    async({ fileId, checked }, { getState, rejectWithValue }) => {
        try {
            const { ratlFiles } = getState().fileUpload;
            const fileToUpdate = ratlFiles.find((file) => file._id === fileId);

            if (!fileToUpdate) {
                throw new Error("File not found");
            }

            const updatedStatus = fileToUpdate.status.map((status) =>
                status.userType === "Email Marketing" ? {...status, checked } : status
            );

            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `${baseUrl}user/updateStatus_rl_tl/${fileId}`, { status: updatedStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || error.message);
        }
    }
);


const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState: {
        status: 'idle',
        message: '',
        ratlFiles: [],
        uploading: false,
    },
    extraReducers: (builder) => {
        builder
        // Upload RAT L File
            .addCase(uploadRatLFile.pending, (state) => {
                state.uploading = true;
            })
            .addCase(uploadRatLFile.fulfilled, (state, action) => {
                state.uploading = false;
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(uploadRatLFile.rejected, (state, action) => {
                state.uploading = false;
                state.status = 'failed';
                state.message = action.payload.message;
            })

        // Get RAT L CSV Files
        .addCase(getRatLCsvFiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRatLCsvFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ratlFiles = action.payload.files;
            })
            .addCase(getRatLCsvFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload.message;
            })

        // Update File Status (Quality)
        .addCase(updateFileStatusQuality.pending, (state) => {
                state.status = 'loading';
                state.uploading = true;
            })
            .addCase(updateFileStatusQuality.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Update the local state with the updated file data
                state.ratlFiles = state.ratlFiles.map(file =>
                    file._id === action.payload._id ? action.payload : file
                );
                state.uploading = false;
            })
            .addCase(updateFileStatusQuality.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload.message;
                state.uploading = false;
            })

        // Update File Status (Email)
        .addCase(updateFileStatusEmail.fulfilled, (state, action) => {
                const index = state.ratlFiles.findIndex((file) => file._id === action.payload.fileId);
                if (index !== -1) {
                    state.ratlFiles[index] = action.payload;
                }
            })
            .addCase(updateFileStatusEmail.rejected, (state, action) => {
                state.message = action.payload.message;
            });
    },
});

export default fileUploadSlice.reducer;