import React from "react";
import { useSelector } from "react-redux";



const Bienvenido = () => (
  <main id="main" className="main">
    <div className="pagetitle animate__animated animate__fadeInTopLeft text-center">
      <h1 className="text-center">
        Bienvenido {useSelector((state) => state.auth.userInfo.userName)}
      </h1>
    </div>
  </main>
);

export default Bienvenido;
