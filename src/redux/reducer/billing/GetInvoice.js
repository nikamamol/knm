// store/invoiceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../constant/ConstantApi";

export const fetchInvoices = createAsyncThunk(
    "invoices/fetchInvoices",
    async() => {
        const response = await axios.get(`${baseUrl}user/getInvoices`);
        return response.data.data;
    }
);

const invoiceSlice = createSlice({
    name: "invoices",
    initialState: {
        invoices: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.status = "succeeded";
                const transformedData = action.payload.map((invoice, index) => {
                    const totalLead = invoice.items.reduce((sum, item) => {
                        const leadCount = Number(item.qty) || 0;
                        return sum + leadCount;
                    }, 0);

                    return {
                        serialNumber: index + 1,
                        invoiceDate: new Date(invoice.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }),
                        vendorName: invoice.clientName,
                        amount: invoice.grandTotal,
                        totalLead: totalLead,
                        actions: invoice._id,
                    };
                });

                state.invoices = transformedData;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default invoiceSlice.reducer;