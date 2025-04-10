import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "menus",
    initialState: {},
    reducers: {
        setMenus: (state, action) => {
            // return action.payload;
            Object.assign(state, action.payload);
        },
    },
});

export const { setMenus } = menuSlice.actions;
export default menuSlice.reducer;
