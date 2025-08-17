import React, { useCallback } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { logout } from "./slices/authSlice";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import AuthVerify from "./helpers/AuthVerify";
import Barras from "./components/Barras";
import Login from "./views/Login";
import Bienvenido from "./views/Bienvenido";
import SubirArchivos from "./views/Archivo/SubirArchvos";
import ObrasPublicas from "./views/Archivo/obraspublicas";

const App = () => {
  const dispatch = useDispatch();
  const logOut = useCallback(() => dispatch(logout()), [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Barras />}>
          <Route path="/home" element={<Bienvenido />} />
          <Route path="/archivo/subir" element={<SubirArchivos />} />
          <Route path="/archivo/obraspublicas" element={<ObrasPublicas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <AuthVerify logOut={logOut} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
};

export default App;
