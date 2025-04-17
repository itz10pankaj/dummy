import {createSlice} from "@reduxjs/toolkit"

const photoSlice = createSlice({
    name: "photos",
    initialState: {}, // Ensure initial state is an empty object
    reducers: {
        setPhotos: (state, action) => {
            Object.assign(state, action.payload);
        },
    },
});
export const {setPhotos} = photoSlice.actions;
export default photoSlice.reducer;