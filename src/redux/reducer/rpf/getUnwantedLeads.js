import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Async thunk for fetching CSV files
export const fetchCsvFilesbyUnwantedLeads = createAsyncThunk(
    "csvFileCheckedbyUnwantedLeads/fetchCsvFilesbyUnwantedLeads",
    async(_, { rejectWithValue }) => {
        const token = localStorage.getItem("authToken");

        // Check if the token is available
        if (!token) {
            return rejectWithValue("Token is not available");
        }

        try {
            const response = await axios.get(
                `${baseUrl}user/getCsvFilesByUnwantedLeadsAll`, {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            // Log the error for debugging
            console.error("Error fetching CSV files:", error);

            // Handle specific axios error response if needed
            return rejectWithValue(error.response || "Error fetching CSV files");
        }
    }
);

// CSV slice
const CsvsliceByUnwantedLeads = createSlice({
    name: "csvFileCheckedbyUnwantedLeads",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
        totalRejectedLeads: 0, // Ensure we initialize totalRejectedLeads
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyUnwantedLeads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyUnwantedLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.csvFiles = action.payload;

                let rejectedLeadsCount = 0;
                action.payload.forEach((file) => {
                    if (file.rejectedLeads && file.rejectedLeads.length > 0) {
                        rejectedLeadsCount += file.rejectedLeads.length;
                    }
                });

                state.totalRejectedLeads = rejectedLeadsCount;
            })
            .addCase(fetchCsvFilesbyUnwantedLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch CSV files"; // Use payload for detailed error
            });
    },
});

// Export the reducer
export default CsvsliceByUnwantedLeads.reducer;