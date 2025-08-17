import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import Spinner from "../Spinner";
import { useEliminarDocumentoMutation } from "../../services/subirArchivos.service";

const EliminarForm = ({ show, onHide, document, refetch }) => {
  const [eliminarDocumento, { isLoading, isSuccess, isError }] =
    useEliminarDocumentoMutation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowAlert(true);
      if (typeof refetch === "function") {
        refetch(); // Solo llama a refetch si es una función
      } else {
        console.error("refetch no es una función");
      }
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onHide();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onHide]);

  const handleDelete = async () => {
    try {
      await eliminarDocumento({ idDocumento: document.idDocumento }).unwrap();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const handleClose = () => {
    onHide();
  };

  if (!document) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#ffc107",
            color: "#212529",
          }}
        >
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            ADVERTENCIA
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {!isSuccess && !isError && (
            <p>
              ¿Estás seguro de que deseas eliminar el documento "
              {document.documento}"?
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            <span className="bi bi-x-circle"></span> Cancelar
          </Button>
          {!isSuccess && !isError && (
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <span className="bi bi-trash3"></span> Eliminar
            </Button>
          )}
          {isLoading && <Spinner />}
        </Modal.Footer>
      </Modal>
      {showAlert && (
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
          <p>El documento ha sido eliminado correctamente.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setShowAlert(false)}
              variant="outline-success"
            >
              Cerrar
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
};

export default EliminarForm;
