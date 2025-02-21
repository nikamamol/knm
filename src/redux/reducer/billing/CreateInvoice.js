// redux/invoiceSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk to create the invoice
export const createInvoice = createAsyncThunk(
    'invoice/createInvoice',
    async(invoiceData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseUrl}user/createInvoice`, invoiceData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoiceData: {
            logo: '',
            date: 'April 20, 2023',
            invoiceNumber: '3452324',
            clientName: 'Test Pvt Ltd.',
            clientAddress: 'xyz, text, United States',
            items: [{
                qty: 3,
                description: 'Lorem, ipsum.',
                price: 10,
                total: 30,
            }, ],
            subTotal: 100,
            tax: 10,
            grandTotal: 110,
            bankName: 'Bank of India',
            accountNumber: '1234567890',
            terms: 'Payment is due within 30 days from the invoice date.',
        },
        isGeneratingPDF: false,
        loading: false,
        error: null,
    },
    reducers: {
        updateInvoiceField: (state, action) => {
            state.invoiceData[action.payload.field] = action.payload.value;
        },
        updateItemField: (state, action) => {
            const { index, field, value } = action.payload;
            state.invoiceData.items[index][field] = value;
        },
        addItem: (state) => {
            state.invoiceData.items.push({
                qty: 0,
                description: '',
                price: 0,
                total: 0,
            });
        },
        removeItem: (state, action) => {
            state.invoiceData.items = state.invoiceData.items.filter((_, index) => index !== action.payload);
        },
        calculateTotals: (state) => {
            const subTotal = state.invoiceData.items.reduce((acc, item) => acc + item.qty * item.price, 0);
            const tax = (subTotal * 10) / 100;
            state.invoiceData.subTotal = subTotal;
            state.invoiceData.tax = tax;
            state.invoiceData.grandTotal = subTotal + tax;
        },
        setGeneratingPDF: (state, action) => {
            state.isGeneratingPDF = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    updateInvoiceField,
    updateItemField,
    addItem,
    removeItem,
    calculateTotals,
    setGeneratingPDF,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;