import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useCerrarExpedienteMutation } from "../../services/subirArchivos.service";
import Spinner from "../Spinner";

const CerrarExpedienteForm = ({ show, onHide, expediente, onSave }) => {
  const [cerrarExpediente, { isLoading }] = useCerrarExpedienteMutation();
  const [nombre, setNombre] = useState(""); // Almacenar 'nombre' como un estado
  const [creador, setCreador] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaCierre, setFechaCierre] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAlert, setShowAlert] = useState(false);
  const fechaCierreInputRef = useRef(null);
  const nombreInputRef = useRef(null);

  // Cargar los valores cuando expediente cambia
  useEffect(() => {
    if (expediente) {
      setNombre(expediente.documento || "Desconocido");
      setFechaIngreso(expediente.fechaIngreso || "N/A");
    }
  }, [expediente]);

  useEffect(() => {
    if (show && nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    if (show && fechaCierreInputRef.current) {
      fechaCierreInputRef.current.focus();
    }
  }, [show]);

  const handleSave = async () => {
    if (!expediente?.idDocumento) {
      console.error("idDocumento de expediente no disponible:", expediente);
      alert("idDocumento de expediente no disponible.");
      return;
    }

    try {
      const fecha = new Date(fechaCierre);
      const fechaConHoraYZona = fecha.toLocaleString("en-US", {
        timeZoneName: "short",
      });

      await cerrarExpediente({
        idDocumento: expediente.idDocumento,
        fechaCierre: fechaConHoraYZona,
      }).unwrap();

      setShowAlert(true);
    } catch (error) {
      console.error("Error al cerrar el expediente:", error);
      alert(
        `Error: ${error?.data?.message || "No se pudo cerrar el expediente"}`
      );
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cerrar Expediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formExpedienteName">
              <Form.Label>Expediente</Form.Label>
              <Form.Control
                type="text"
                value={nombre} // Mostrar el 'nombre' aquí
                disabled
                ref={nombreInputRef} // Agregar el ref al input de nombre
              />
            </Form.Group>

            <Form.Group controlId="formExpedienteFechaIngreso">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control type="text" value={fechaIngreso} disabled />
            </Form.Group>

            <Form.Group controlId="formExpedienteFechaCierre">
              <Form.Label>
                <b>Fecha de Cierre</b>
              </Form.Label>
              <Form.Control
                type="date"
                value={fechaCierre}
                onChange={(e) => setFechaCierre(e.target.value)}
                ref={fechaCierreInputRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Guardando...</span>
              </>
            ) : (
              <>
                <span className="bi bi-floppy"></span> Guardar
              </>
            )}
          </Button>
          <Button variant="danger" onClick={onHide}>
            <span className="bi bi-x-circle"></span> Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Alert
        show={showAlert}
        variant="success"
        onClose={() => setShowAlert(false)}
        dismissible
        style={{
          position: "absolute",
          top: "60px",
          right: "20px",
          minWidth: "200px",
        }}
      >
        <Alert.Heading>Éxito</Alert.Heading>
        <p>El expediente ha sido cerrado correctamente.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShowAlert(false)} variant="outline-success">
            Cerrar
          </Button>
        </div>
      </Alert>
    </>
  );
};

export default CerrarExpedienteForm;
