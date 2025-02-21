import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Function to get the token dynamically in case it updates
const getToken = () => localStorage.getItem("authToken");

export const fetchCsvFilesbyQualityMaster = createAsyncThunk(
    "csvFileCheckedbyQualityMaster/fetchCsvFilesbyQualityMaster",
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseUrl}user/qualityMasterCsvFile`, {
                headers: {
                    "authorization": `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.files;
        } catch (error) {
            return rejectWithValue(error.response || "Error fetching files");
        }
    }
);

const CsvsliceByQualityMaster = createSlice({
    name: "csvFileCheckedbyQualityMaster",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyQualityMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyQualityMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.csvFiles = action.payload;
            })
            .addCase(fetchCsvFilesbyQualityMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default CsvsliceByQualityMaster.reducer;