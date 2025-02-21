import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Async thunk for fetching client details
export const fetchClientDetails = createAsyncThunk(
    'client/fetchClientDetails',
    async(id) => {
        const response = await axios.get(`${baseUrl}user/clientDetails/${id}`);
        return response.data;
    }
);

// Async thunk for updating client details
export const updateClientDetails = createAsyncThunk(
    'client/viewClient',
    async({ id, details }) => {
        await axios.put(`${baseUrl}user/updateClient/${id}`, details);
        return details;
    }
);

const clientDetailsSlice = createSlice({
    name: 'clientDetails',
    initialState: {
        details: {
            company_name: '',
            client_name: '',
            mobile: '',
            email: '',
            address: '',
            country: '',
            city: '',
            pincode: ''
        },
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClientDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchClientDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateClientDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateClientDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(updateClientDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default clientDetailsSlice.reducer;