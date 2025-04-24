import { createSlice } from "@reduxjs/toolkit";

const logSlice=createSlice({
    name:"logs",
    initialState:{},
    reducers:{
        setLogs:(state,action)=>{
            Object.assign(state,action.payload);
        }
    }
})

export const {setLogs}=logSlice.actions;
export default logSlice.reducer;