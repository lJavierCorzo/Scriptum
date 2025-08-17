import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import Spinner from "../Spinner";
import styled from "styled-components";

const CustomModal = styled(Modal)`
  .modal-dialog {
    width: 90vw;
    max-width: 65vw;
  }
`;

const EventosForm = ({ show, onHide, eventosData, isLoading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(10);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error al cargar los eventos</div>;

  // Lógica de paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventosData?.data.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(eventosData?.data.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEventsPerPageChange = (event) => {
    setEventsPerPage(Number(event.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar la cantidad por página
  };

  const totalRecords = eventosData?.data.length;
  const startRecord = indexOfFirstEvent + 1;
  const endRecord =
    indexOfLastEvent > totalRecords ? totalRecords : indexOfLastEvent;

  return (
    <CustomModal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Eventos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {eventosData?.data.length > 0 ? (
          <>
            <Table striped bordered hover responsive="md">
              <thead>
                <tr>
                  <th>Acción</th>
                  <th>Versión</th>
                  <th>Fecha</th>
                  <th>Autor</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((evento) => (
                  <tr key={evento.idEvento}>
                    <td>{evento.accion?.accion || ""}</td>
                    <td>{evento.version || ""}</td>
                    <td>{evento.fechaVersion || ""}</td>
                    <td>{evento.usuario || ""}</td>
                    <td>{evento.descripcion || ""}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                Mostrando {startRecord} a {endRecord} de {totalRecords}{" "}
                registros
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
              <Form.Control
                as="select"
                value={eventsPerPage}
                onChange={handleEventsPerPageChange}
                style={{ width: "auto" }}
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} por página
                  </option>
                ))}
              </Form.Control>
            </div>
          </>
        ) : (
          <div>No hay eventos disponibles.</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </CustomModal>
  );
};

export default EventosForm;
