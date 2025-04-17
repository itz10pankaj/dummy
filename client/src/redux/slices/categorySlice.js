import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "categories",
    initialState: [],
    reducers: {
        setCategories: (state, action) => {
        return action.payload;
        },
        addCategory: (state, action) => {
        state.push(action.payload);
        },
    },
});

export const { setCategories, addCategory } = categorySlice.actions;
export default categorySlice.reducer;
