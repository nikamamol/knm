// src/redux/userSession/userSessionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';


// Async logout action using createAsyncThunk
export const logoutUser = createAsyncThunk(
    'userSession/logoutUser',
    async(userId, { rejectWithValue }) => {
        try {
            // Make the logout API request
            await axios.post(`${baseUrl}user/logout`, { userId });

            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('timer');

            return true; // Return true if logout is successful
        } catch (error) {
            console.error('Logout error:', error);
            return rejectWithValue(error.response || 'Logout failed');
        }
    }
);

const userSessionSlice = createSlice({
    name: 'userSession',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
        // Handle logout action
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Logout failed';
            });
    },
});

// Export actions and reducer
export const { setUser, clearUser } = userSessionSlice.actions;
export default userSessionSlice.reducer;