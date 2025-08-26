import { createSlice } from "@reduxjs/toolkit";
import { IFacadeState } from "./IFacadeState";
import { Status } from "@lib/constants/enum";
import { createFacade, getFacades } from "./facadeThunk";

export const facadeSlice = createSlice({
    name: "facade",
    initialState: {
        facades: [] as IFacadeState[],
        status: Status.IDLE,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFacades.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getFacades.fulfilled, (state, action) => {
            state.facades = action.payload.facades;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getFacades.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(createFacade.fulfilled, (state, action) => {
            state.facades.push(action.payload);
        });
    }
})
 
export default facadeSlice.reducer