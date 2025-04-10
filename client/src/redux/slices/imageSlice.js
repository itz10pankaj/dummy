import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: "images",
    initialState: {}, // Ensure initial state is an empty object
    reducers: {
        setImages: (state, action) => {
            // return { ...state, ...action.payload };
            Object.assign(state, action.payload);
        },
    },
});

export const { setImages } = imageSlice.actions;
export default imageSlice.reducer;
