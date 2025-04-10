import { createSlice } from "@reduxjs/toolkit";

// ✅ Function to get user from cookies for hydration
const getUserFromCookies = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));
    return userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
  }
  return null;
};

const initialState = {
  user: getUserFromCookies() || null, // ✅ Get from cookies (if available)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(action.payload))}; path=/;`;
    },
    logout: (state) => {
      state.user = null;
      document.cookie = "user=; Max-Age=0; path=/";
      if (typeof window !== "undefined") {
        window.__INITIAL_DATA__.user = null;
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
