import { createSlice } from "@reduxjs/toolkit";
import { menuApi } from "../services/menu.service";



const initialState = {
  loading: false,
  menu: null,
  error: null,
  success: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addMatcher(menuApi.endpoints.findMenu.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      console.log("pruebapendiente");
    });
    builder.addMatcher(menuApi.endpoints.findMenu.matchFulfilled, (state, { payload }) => {
      state.loading = false;
      console.log("menuu:", payload);
      state.menu = payload; 
      state.success = true;
      console.log("pruebafull:", state.menu);
    });
    builder.addMatcher(menuApi.endpoints.findMenu.matchRejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default menuSlice.reducer;
