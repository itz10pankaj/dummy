import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name: "items",
    initialState: {},
    reducers: {
        setItems: (state, action) => {
            // return action.payload;
            Object.assign(state, action.payload);
        },
    },
});

export const { setItems } = itemSlice.actions;
export default itemSlice.reducer;
