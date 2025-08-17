import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./helpers/store";  // Asegúrate de importar correctamente tu store
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>  {/* Este es el Provider */}
    <App />
  </Provider>
);
