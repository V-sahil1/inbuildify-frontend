import { Status } from "@lib/constants/enum";
import { createSlice } from "@reduxjs/toolkit";
import { createStructuralThunk, deleteStructuralThunk, getStructuralThunk, updateStructuralThunk } from "./structuralEnggThunk";

const initialState: any = {
    status: Status.IDLE,
    structuralengg: [],
};

const structuralSlice = createSlice({
    name: "structural",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getStructuralThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getStructuralThunk.fulfilled, (state, action) => {
            state.structuralengg = action.payload.engineers;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getStructuralThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });

        builder.addCase(createStructuralThunk.fulfilled, (state, action) => {
            state.structuralengg.push(action.payload);
            state.status = Status.SUCCESS;
        });
        builder.addCase(updateStructuralThunk.fulfilled, (state, action) => {
            const index = state.structuralengg.findIndex((item: any) => item.structureEngineerId === action.payload.structureEngineerId);
            if (index !== -1) {
                state.structuralengg[index] = action.payload;
            }
            state.status = Status.SUCCESS;
        });
        builder.addCase(deleteStructuralThunk.fulfilled, (state, action) => {
            const index = state.structuralengg.findIndex((item: any) => item.key === action.meta.arg);
            if (index !== -1) {
                state.structuralengg.splice(index, 1);
            }
            state.status = Status.SUCCESS;
        });
    }
});

export const { actions, reducer } = structuralSlice;
export default structuralSlice.reducer;