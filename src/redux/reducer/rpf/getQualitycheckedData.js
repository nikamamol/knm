import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Async thunk for fetching CSV files
export const fetchCsvFilesbyQualityChecked = createAsyncThunk(
    "csvFileCheckedbyQualityChecked/fetchCsvFilesbyQualityChecked",
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("authToken"); // Fetch token inside the thunk
            const response = await axios.get(
                `${baseUrl}user/getCsvFilesByQualityCheckedAll`, {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// CSV slice
const CsvsliceByQualityChecked = createSlice({
    name: "csvFileCheckedbyQualityChecked",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyQualityChecked.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyQualityChecked.fulfilled, (state, action) => {
                state.loading = false;
                state.csvFiles = action.payload;
            })
            .addCase(fetchCsvFilesbyQualityChecked.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default CsvsliceByQualityChecked.reducer;