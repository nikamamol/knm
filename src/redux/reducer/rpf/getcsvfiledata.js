import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Utility to get the token from local storage
const getToken = () => localStorage.getItem("authToken");

// Thunk for fetching file data
export const fetchFileData = createAsyncThunk(
    "fileData/fetchFileData",
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseUrl}user/csvFileData`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            // console.error("Error fetching file data:", error);
            return rejectWithValue(error.response ? error.response.data : { message: "An unexpected error occurred." });
        }
    }
);

export const fetchFileDataAll = createAsyncThunk(
    'fileData/fetchFileDataAll',
    async(_, { rejectWithValue }) => {
        try {
            const token = getToken(); // Ensure you have this function implemented correctly
            const response = await axios.get(`${baseUrl}user/csvFileAllData`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data; // Return the data directly from the response
        } catch (error) {
            // console.error('Error fetching all file data:', error); // Log the error for debugging
            return rejectWithValue(error.response ? error.response.data : { message: 'An unexpected error occurred.' });
        }
    }
);
// Thunk for downloading a file
export const downloadFile = createAsyncThunk(
    "fileData/downloadExcelFile",
    async({ fileId, filename }, { rejectWithValue }) => {
        try {
            const token = getToken(); // Retrieve the JWT token
            // console.log(
            //     `Starting Excel file download: ${filename} with fileId: ${fileId}`
            // );

            const response = await axios.get(
                `${baseUrl}user/downloadCsvFileById/${fileId}`, {
                    responseType: "blob", // Receive the file as a Blob
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the header
                    },
                }
            );

            // console.log("Excel file download response received:", response);

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
            // console.error("Error during Excel file download:", error);
            return rejectWithValue(error.response || error.message);
        }
    }
);

export const updateCsvFileById = createAsyncThunk(
    "fileData/updateCsvFileById",
    async({ fileId, fileData, updatedData }, { rejectWithValue }) => {
        try {
            const token = getToken();
            const formData = new FormData();
            formData.append("file", fileData.file); // Assuming fileData.file is the file blob

            // Check if the fileData contains a path
            if (fileData.path) {
                formData.append("path", fileData.path);
            }

            // Log updatedData to ensure it is correctly structured
            // console.log("Updated Data:", updatedData);
            formData.append("updatedData", JSON.stringify(updatedData)); // Ensure it's a string

            const response = await axios.put(
                `${baseUrl}user/updateCsvFileById/${fileId}`,
                formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // console.log("Response Data:", response.data);
            return response.data; // Return the response data
        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            // console.error("Error updating file:", errorMessage); // Log the error for debugging
            return rejectWithValue(errorMessage);
        }
    }
);



export const readFile = createAsyncThunk(
    "fileData/readFile",
    async({ fileId }, { rejectWithValue }) => {
        try {
            const token = getToken();
            const response = await axios.get(`${baseUrl}user/csvFileData/${fileId}`, {
                responseType: "arraybuffer", // Change to 'arraybuffer' for reading the file
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { arrayBuffer: response.data }; // Return the arrayBuffer
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

// Thunk for updating file status (Quality)
export const updateFileStatus = createAsyncThunk(
    "fileData/updateFileStatusQuality",
    async({ fileId, checked }, { getState, rejectWithValue }) => {
        try {
            const { files } = getState().fileData;
            const fileToUpdate = files.find((file) => file.fileId === fileId);

            if (!fileToUpdate) {
                throw new Error("File not found");
            }

            const updatedStatus = fileToUpdate.status.map((status) =>
                status.userType === "Quality" ? {...status, checked } : status
            );

            const token = getToken();
            const response = await axios.put(
                `${baseUrl}user/updateStatus/${fileId}`, {
                    status: updatedStatus,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

// Thunk for updating file status (Email)
export const updateFileStatusEmail = createAsyncThunk(
    "fileData/updateFileStatusEmail",
    async({ fileId, statusId, checked }, { getState, rejectWithValue }) => {
        try {
            const { files } = getState().fileData;
            const fileToUpdate = files.find((file) => file.fileId === fileId);

            if (!fileToUpdate) {
                throw new Error("File not found");
            }

            const updatedStatus = fileToUpdate.status.map((status) =>
                status.userType === "Email Marketing" ? {...status, checked } : status
            );

            const token = getToken();
            const response = await axios.put(
                `${baseUrl}user/updateStatus/${fileId}`, {
                    status: updatedStatus,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

// Thunk for deleting a file
export const deleteFile = createAsyncThunk(
    "fileData/deleteFile",
    async(fileId, { rejectWithValue }) => {
        try {
            const token = getToken();
            const response = await axios.delete(
                `${baseUrl}user/csvFileData/${fileId}`, {
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

const fileDataSlice = createSlice({
    name: "fileData",
    initialState: {
        files: [],
        status: "idle",
        error: null,
        statusData: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFileData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchFileData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = action.payload.files.map((file, index) => ({
                    serialNumber: index + 1,
                    filename: file.originalname,
                    campaignName: file.campaignName,
                    campaignCode: file.campaignCode,
                    createdAt: new Date(file.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                    fileId: file._id,
                    status: file.status,
                }));

                state.statusData = action.payload.status; // Update statusData with fetched status
            })
            .addCase(fetchFileData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(downloadFile.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateFileStatus.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateFileStatus.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = state.files.map((file) =>
                    file.fileId === action.payload.fileId ? {...file, status: action.payload.status } :
                    file
                );
            })
            .addCase(updateFileStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateFileStatusEmail.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateFileStatusEmail.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = state.files.map((file) =>
                    file.fileId === action.payload.fileId ? {...file, status: action.payload.status } :
                    file
                );
            })
            .addCase(updateFileStatusEmail.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteFile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = state.files.filter(
                    (file) => file._id !== action.meta.arg
                );
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchFileDataAll.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchFileDataAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = action.payload.files.map((file, index) => ({
                    serialNumber: index + 1,
                    filename: file.originalname,
                    campaignName: file.campaignName,
                    campaignCode: file.campaignCode,
                    createdAt: new Date(file.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                    fileId: file._id,
                    status: file.status,
                }));
                state.statusData = action.payload.status;
            })
            .addCase(fetchFileDataAll.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(readFile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(readFile.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Handle file data here if needed
            })
            .addCase(readFile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateCsvFileById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCsvFileById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = state.files.map((file) =>
                    file.fileId === action.payload.fileId ? {...file, ...action.payload.file } :
                    file
                );
            })
            .addCase(updateCsvFileById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default fileDataSlice.reducer;