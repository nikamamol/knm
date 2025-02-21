import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

// Async thunk for fetching a template by ID
export const fetchTemplateById = createAsyncThunk(
    "template/fetchTemplateById",
    async(id) => {
        const response = await axios.get(
            `${baseUrl}user/templates/${id}`
        );
        return response.data;
    }
);

const templateSliceById = createSlice({
    name: "templateId",
    initialState: {
        template: null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplateById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTemplateById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.template = action.payload;
            })
            .addCase(fetchTemplateById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default templateSliceById.reducer;