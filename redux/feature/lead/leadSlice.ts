import { createSlice } from "@reduxjs/toolkit";
import { createLeadThunk, getLeadThunk } from "./leadThunk";
import { ILead } from "./ILeadState";
import { Status } from "@lib/constants/enum";

export const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads:[] as ILead[],
        status: Status.IDLE,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLeadThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getLeadThunk.fulfilled, (state, action) => {
            state.leads = action.payload;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getLeadThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(createLeadThunk.fulfilled, (state, action) => {
            state.leads.push(action.payload);
        });
    }
});

export const leadReducer = leadSlice.reducer;
