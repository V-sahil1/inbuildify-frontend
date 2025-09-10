import { Status } from "@lib/constants/enum";
import { createSlice } from "@reduxjs/toolkit";
import { getActionsThunk } from "./actionThunk";

export const actionSlice = createSlice({
    name: "action",
    initialState:{
        actions: [],
        status: Status.IDLE,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getActionsThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getActionsThunk.fulfilled, (state, action) => {
            state.actions = action.payload;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getActionsThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
    },
});

export default actionSlice.reducer;