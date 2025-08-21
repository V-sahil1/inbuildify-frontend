import { createSlice } from "@reduxjs/toolkit";
import { createLeadThunk, getLeadThunk } from "./leadThunk";

export const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLeadThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLeadThunk.fulfilled, (state, action) => {
            state.leads = action.payload;
            state.loading = false;
        });
        builder.addCase(getLeadThunk.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLeadThunk.fulfilled, (state, action) => {
            state.leads.push(action.payload);
        });
    }
});

export const leadReducer = leadSlice.reducer;
