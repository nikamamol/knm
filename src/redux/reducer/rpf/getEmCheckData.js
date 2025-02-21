import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

const token = localStorage.getItem("authToken");

// Async thunk for fetching CSV files
export const fetchCsvFilesbyEMChecked = createAsyncThunk(
    "csvFileCheckedbyEMChecked/fetchCsvFilesbyEMChecked",
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("authToken"); // Move token retrieval inside the function
            const response = await axios.get(
                `${baseUrl}user/getCsvFilesByEMCheckedAll`, {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            // If unauthorized, return a rejected action with an error message
            if (error.response && error.response.status === 401) {
                return rejectWithValue('Unauthorized access - please log in again.');
            }
            return rejectWithValue(error.message); // Return other error messages
        }
    }
);


// CSV slice
const CsvsliceByEMChecked = createSlice({
    name: "csvFileCheckedbyEMChecked",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyEMChecked.pending, (state) => { // Reference the thunk correctly
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyEMChecked.fulfilled, (state, action) => { // Reference the thunk correctly
                state.loading = false;
                state.csvFiles = action.payload;
            })
            .addCase(fetchCsvFilesbyEMChecked.rejected, (state, action) => { // Reference the thunk correctly
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export default CsvsliceByEMChecked.reducer;