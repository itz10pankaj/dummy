import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import courseReducer from "./slices/courseSlice.js";
import menuReducer from "./slices/menuSlice.js"
import contentReducer from "./slices/contentSlice.js"
import imageReducer from "./slices/imageSlice.js"
import categoryReducer from "./slices/categorySlice.js"
import itemReducer from "./slices/itemsSlice.js"
import photoReducer from "./slices/photoSlice.js"
const preloadedState = typeof window !== "undefined" ? window.__PRELOADED_STATE__ || {} : {};
// const preloadedState={}
const store = configureStore({ 
  reducer: {
    auth: authReducer,
    courses:courseReducer,
    menus: menuReducer,
    contents: contentReducer,
    images:imageReducer,
    categories:categoryReducer,
    items:itemReducer,
    photos:photoReducer
  },
  preloadedState
});
if (typeof window !== "undefined") {
  delete window.__PRELOADED_STATE__;
}
export default store;
