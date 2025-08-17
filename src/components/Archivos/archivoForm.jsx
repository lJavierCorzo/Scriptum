import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useCargarDocumentoMutation } from "../../services/subirArchivos.service";

const ArchivoForm = ({ show, onHide, idDocumentoPadre, refetch }) => {
  const { handleSubmit, reset } = useForm();
  const [cargarDocumento] = useCargarDocumentoMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (show) {
      reset();
      setSelectedFile(null);
      setShowAlert(false);
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [show, reset]);

  const handleClose = () => {
    onHide();
  };

  const onSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      await cargarDocumento({
        idDocumentoPadre,
        documento: selectedFile,
      }).unwrap();

      setShowAlert(true);
      await refetch();
      handleClose();
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
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
          <p>El archivo ha sido cargado correctamente.</p>
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
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cargar Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formFile" className="mb-3">
              {!uploading && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    border: "2px dashed #6c757d",
                    padding: "15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current.click()}
                >
                  <i
                    className="bi bi-arrow-bar-up"
                    style={{ fontSize: "2em", color: "#6c757d" }}
                  ></i>
                  {selectedFile ? (
                    <span style={{ color: "blue" }}>{selectedFile.name}</span>
                  ) : (
                    <span>Seleccione o arrastre archivo a subir</span>
                  )}
                </div>
              )}
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx,.xlsx"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </Form.Group>
            {selectedFile && !uploading && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!selectedFile}
                >
                  <i className="bi bi-upload"></i>
                </Button>
                <Button variant="danger" onClick={handleRemoveFile}>
                  <i className="bi bi-x-lg"></i>
                </Button>
              </div>
            )}
            {uploading && (
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span style={{ color: "blue" }}>{selectedFile.name}</span>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ArchivoForm;
