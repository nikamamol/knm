import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

export const fetchInvoiceById = createAsyncThunk(
    'invoice/fetchInvoiceById',
    async(id) => {
        const response = await axios.get(`${baseUrl}user/getInvoiceById/${id}`);
        return response.data.data;
    }
);

// New async thunk for deleting an invoice
export const deleteInvoiceById = createAsyncThunk(
    'invoice/deleteInvoiceById',
    async(id) => {
        await axios.delete(`${baseUrl}user/deleteInvoiceById/${id}`); // Update with your correct API endpoint
        return id; // Return the ID of the deleted invoice
    }
);

const invoiceSlicebyid = createSlice({
    name: 'invoice',
    initialState: {
        data: null,
        loading: false,
        error: null,
        deleteLoading: false,
        deleteError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle delete invoice actions
            .addCase(deleteInvoiceById.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null; // Reset any previous error
            })
            .addCase(deleteInvoiceById.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.data = null; // Clear data or handle state accordingly
            })
            .addCase(deleteInvoiceById.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.error.message;
            });
    },
});

export default invoiceSlicebyid.reducer;