import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../lib/store";
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  windowSize: 767,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user || null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    setWindowSize(state, action) {
      state.windowSize = action.payload;
    },
  },
});

export const logoutUser = () => async(dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(logout());
  window.location.reload();
};

export const { setAuth, setLoading, logout, setWindowSize } = authSlice.actions;

export default authSlice.reducer;
