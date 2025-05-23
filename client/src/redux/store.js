import { configureStore } from "@reduxjs/toolkit";
import { createStateSyncMiddleware } from "redux-state-sync";
import authReducer from "./slices/authSlice.js";
import courseReducer from "./slices/courseSlice.js";
import menuReducer from "./slices/menuSlice.js"
import contentReducer from "./slices/contentSlice.js"
import imageReducer from "./slices/imageSlice.js"
import categoryReducer from "./slices/categorySlice.js"
import itemReducer from "./slices/itemsSlice.js"
import photoReducer from "./slices/photoSlice.js"
import logReducer from "./slices/logsSLice.js"
import formReducer from "./slices/formSlice.js";
const preloadedState = typeof window !== "undefined" ? window.__PRELOADED_STATE__ || {} : {};
const stateSyncMiddleware = createStateSyncMiddleware();
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
    photos:photoReducer,
    logs:logReducer,
    form: formReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stateSyncMiddleware),
});
if (typeof window !== "undefined") {
  delete window.__PRELOADED_STATE__;
}
export default store;
