import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiCall } from "../helpers/apiCall";

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ user, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiCall(
        "tokens/user",
        { user, password },
        { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        "POST"
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.removeItem("respuestasActuales");
      return data;
    } catch (error) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userLogout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("respuestasActuales");
      return;
    } catch (error) {
      // Manejo de errores en caso de que falle el proceso de cierre de sesión
      return rejectWithValue(error.message);
    }
  }
);
