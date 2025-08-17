import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import Spinner from "../Spinner";
import { useAperturarExpedienteMutation } from "../../services/subirArchivos.service";

const ExpedienteForm = ({ show, onHide, idNivel }) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    setValue,
  } = useForm();
  const [aperturarExpediente] = useAperturarExpedienteMutation();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const firstFieldRef = useRef(null);
  const [documento, setDocumento] = useState("");

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const formattedDate = formatDate(now);
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${formattedDate} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (show) {
      reset({
        documento: "",
        asunto: "",
        fechaApertura: formatDate(new Date()),
      });
      setDocumento("");
      if (firstFieldRef.current) {
        firstFieldRef.current.focus();
      }
    }
  }, [show, reset]);

  const handleClose = () => {
    onHide();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fechaApertura = getFormattedDateTime();
      await aperturarExpediente({
        documento: data.documento,
        idNivel: idNivel || "",
        asunto: data.asunto,
        fechaApertura: fechaApertura,
      }).unwrap();
      setShowAlert(true);
      reset();
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error) {
      console.error("Error al guardar el expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Expediente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="documento" className="fw-bold">
              <Form.Label>Expediente</Form.Label>
              <Form.Control
                type="text"
                value={documento}
                onChange={(e) => {
                  setDocumento(e.target.value);
                  setValue("documento", e.target.value);
                }}
                isInvalid={!!errors.documento}
                ref={firstFieldRef}
              />
              <Form.Control.Feedback type="invalid">
                {errors.documento && "El documento es requerido."}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="asunto" className="fw-bold">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("asunto")}
                style={{ resize: "vertical" }}
              />
            </Form.Group>

            <Form.Group controlId="fechaApertura" className="fw-bold">
              <Form.Label>Fecha de Apertura</Form.Label>
              <Form.Control
                type="text"
                defaultValue={formatDate(new Date())}
                {...register("fechaApertura")}
                readOnly
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={loading}>
              <span className="bi bi-floppy mr-2"></span> Guardar
            </Button>
            <Button variant="danger" onClick={handleClose} disabled={loading}>
              <span className="bi bi-x-circle"></span> Cancelar
            </Button>
            {loading && <Spinner />}
          </Modal.Footer>
        </Form>
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
        <p>Los datos han sido guardados correctamente.</p>
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

export default ExpedienteForm;
