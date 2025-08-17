import { Spinner as CustomSpinner } from "react-bootstrap";

const Spinner = () => (
  <div
    className="spinnerContainer"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Ocupa toda la pantalla
      width: "100vw",  // Ancho completo
      position: "fixed", // Fijo en el centro
      top: 0,
      left: 0,
      background: "rgba(255, 255, 255, 0.68)", // Fondo semitransparente
      zIndex: 9999, // Por encima de todo
    }}
  >
    <CustomSpinner
      animation="border"
      className="spinnerTrans"
      style={{ width: "7rem", height: "7rem",  color: "black"  }} // Tamaño ajustable
    />
  </div>
);

export default Spinner;
