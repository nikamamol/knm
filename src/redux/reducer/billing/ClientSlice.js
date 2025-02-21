import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  const response = await axios.get(`${baseUrl}user/getAllClient`);
  return response.data;
});

export const deleteClient = createAsyncThunk('clients/deleteClient', async (clientId) => {
  await axios.delete(`${baseUrl}user/deleteClient/${clientId}`);
  return clientId;
});


const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.map((client, index) => ({
          id: client._id,
          serialNumber: index + 1,
          companyName: client.company_name,
          pocName: client.client_name,
          mobile: client.mobile,
          email: client.email,
          city: client.city,
        }));
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.data = state.data.filter((client) => client.id !== action.payload);
      });
  },
});

export default clientSlice.reducer;
