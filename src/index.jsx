import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import "@react-pdf-viewer/core/lib/styles/index.css";
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./helpers/store"; // Importa tu store desde helpers/store
import { Provider } from "react-redux";  // Importa Provider de react-redux
import { Worker } from '@react-pdf-viewer/core'; // Importa Worker de @react-pdf-viewer/core

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Asegura que tu app esté envuelta en el Provider */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">  {/* Usamos Worker para los PDF */}
        <App />  {/* Tu componente principal */}
      </Worker>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();  // Medición de rendimiento
