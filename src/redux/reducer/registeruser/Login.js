import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

// Define an initial state
const initialState = {
    email: '',
    token: '',
    error: '',
    message: '',
    isLoading: false,
};

// Create an async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseUrl}user/login`, { email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : 'An error occurred. Please try again.');
        }
    }
);

// Create a slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = '';
                state.message = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.email = action.payload.email;
                state.token = action.payload.token;
                state.message = action.payload.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;