import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
    name: "contents",
    initialState: {}, // Ensure initial state is an empty object
    reducers: {
        setContents: (state, action) => {
            // console.log("Previous State:", JSON.parse(JSON.stringify(state)));
            // console.log("Payload:", action.payload);
            // return { ...state, ...action.payload }; // Spread previous state to prevent undefined values
            Object.assign(state, action.payload);
        },
    },
});

export const { setContents } = contentSlice.actions;
export default contentSlice.reducer;
