import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    AadharNumber: "",
    PanNumber: "",
    Contact: "",
    countryCode: "+91",
    text:""
  },
  reducers: {
    updateForm: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = formSlice.actions;
export default formSlice.reducer;