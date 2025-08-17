import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import menuReducer from "../slices/menuSlice";
import { authApi } from "./../services/auth.service";
import { subirArchivosApi } from "../services/subirArchivos.service";
import { menuApi } from "../services/menu.service";


const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    [authApi.reducerPath]: authApi.reducer,
    [subirArchivosApi.reducerPath]: subirArchivosApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(subirArchivosApi.middleware)
      .concat(menuApi.middleware),
});

export default store;
