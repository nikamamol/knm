import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Async thunk for fetching CSV files
export const fetchCsvFilesbyEMMaster = createAsyncThunk(
    "csvFileCheckedbyEMMaster/fetchCsvFilesbyEMMaster",
    async(_, { rejectWithValue }) => {
        const token = localStorage.getItem("authToken"); // Move token retrieval here
        try {
            const response = await axios.get(
                `${baseUrl}user/getCsvFilesByEMMasterAll`, {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            return rejectWithValue(error.response || "Something went wrong");
        }
    }
);

// CSV slice
const CsvsliceByEMMaster = createSlice({
    name: "csvFileCheckedbyEMMaster",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyEMMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyEMMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.csvFiles = action.payload;
            })
            .addCase(fetchCsvFilesbyEMMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch data";
            });
    },
});

export default CsvsliceByEMMaster.reducer;