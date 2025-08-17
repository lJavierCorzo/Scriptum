import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useRenombrarDocumentoMutation } from "../../services/subirArchivos.service";
import Spinner from "../Spinner";

const RenombrarForm = ({ show, onHide, document, onSave }) => {
  const [renombrarDocumento, { isLoading }] = useRenombrarDocumentoMutation();
  const [nombre, setNombre] = useState("");
  const [extension] = useState(document?.extension || "");

  const [showAlert, setShowAlert] = useState(false);
  const nombreInputRef = useRef(null);

  useEffect(() => {
    if (document) {
      setNombre(document.documento);
    }
  }, [document]);

  useEffect(() => {
    if (show && nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, [show]);

  const handleSave = async () => {
    try {
      await renombrarDocumento({
        idDocumento: document.idDocumento,
        documento: nombre,
        extension,
      }).unwrap();
      setShowAlert(true);
      if (onSave) onSave();
      onHide();
    } catch (error) {
      console.error("Error al renombrar el documento:", error);
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
          <Modal.Title>Renombrar Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDocumentName">
              <Form.Label>Nombre del Documento</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nuevo nombre"
                ref={nombreInputRef}
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
        <p>El documento ha sido renombrado correctamente.</p>
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

export default RenombrarForm;
