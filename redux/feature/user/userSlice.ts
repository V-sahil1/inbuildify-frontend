import { createSlice } from "@reduxjs/toolkit";
import { getUsersThunk } from "./userThunk";
import { UserInitialState } from "./UserState";
import { Status } from "@lib/constants/enum";

const initialState:UserInitialState = {
   users:[],
   status:Status.IDLE
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase(getUsersThunk.pending,(state)=>{
            state.status = Status.PENDING
        })
        builder.addCase(getUsersThunk.fulfilled,(state,action)=>{
            state.status = Status.SUCCESS
            state.users = action.payload.data
        })
        builder.addCase(getUsersThunk.rejected,(state)=>{
            state.status = Status.ERROR
        })
    }
})

export const { } = userSlice.actions
export default userSlice.reducer