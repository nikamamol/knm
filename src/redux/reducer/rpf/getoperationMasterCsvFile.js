import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Fetch token
const token = localStorage.getItem("authToken");

export const fetchCsvFilesbyOPMaster = createAsyncThunk(
    "csvFileCheckedbyOPMaster/fetchCsvFilesbyOPMaster",
    async(_, { rejectWithValue }) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return rejectWithValue("No authentication token found. Please log in.");
        }
        try {
            const response = await axios.get(`${baseUrl}user/getCsvFilesByOpMasterAll`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.files;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


const CsvsliceByOPMaster = createSlice({
    name: "csvFileCheckedbyOPMaster",
    initialState: {
        csvFiles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsvFilesbyOPMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCsvFilesbyOPMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.csvFiles = action.payload;
            })
            .addCase(fetchCsvFilesbyOPMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default CsvsliceByOPMaster.reducer;