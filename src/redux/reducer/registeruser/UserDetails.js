// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async(_, { rejectWithValue }) => {
        const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
        try {
            const response = await axios.get(`${baseUrl}user/userdetails`, {
                headers: {
                    Authorization: token // Send the token in the authorization header
                }
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : 'Error fetching user details');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;