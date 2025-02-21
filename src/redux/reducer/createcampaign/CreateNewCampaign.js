import { combineReducers, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../constant/ConstantApi';

const initialState = {
    campaigns: [],
    loading: false,
    error: null,
};

export const createNewCampaign = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        fetchCampaignsStart: (state) => {
            state.loading = true;
        },
        fetchCampaignsSuccess: (state, action) => {
            state.campaigns = action.payload;
            state.loading = false;
        },
        fetchCampaignsFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addCampaign: (state, action) => {
            state.campaigns.push(action.payload);
        },
    },
});

// Export the action creators
export const {
    fetchCampaignsStart,
    fetchCampaignsSuccess,
    fetchCampaignsFailure,
    addCampaign,
} = createNewCampaign.actions;

// Thunk function for creating a campaign
export const createCampaign = (campaignData) => async(dispatch) => {
    dispatch(fetchCampaignsStart());
    try {
        const response = await axios.post(`${baseUrl}user/createcampaign`, campaignData);
        dispatch(addCampaign(response.data));
        dispatch(fetchCampaignsSuccess([response.data]));
    } catch (error) {
        dispatch(fetchCampaignsFailure(error.message));
    }
};

// Export the reducer





const rootReducer = combineReducers({
    campaign: createCampaign,
    // other reducers...
});

export default rootReducer;