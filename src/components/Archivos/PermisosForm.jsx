import React from "react";
import { Modal, Button, Spinner, Table } from "react-bootstrap";
import styled from "styled-components";

const CustomModal = styled(Modal)`
  .modal-dialog {
    width: 90vw;
    max-width: 65vw;
  }
`;

const PermisosForm = ({ show, onHide, permisos, loading }) => {
  return (
    <CustomModal show={show} onHide={onHide} size="lg" centered>
      <CustomModal show={show} onHide={onHide} size="lg" centered></CustomModal>
      <Modal.Header closeButton>
        <Modal.Title>Permisos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tipo de Permiso</th>
                <th>Estatus</th>
                <th>Clase de Permiso</th>
                <th>Usuario/Rol</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((permiso) => (
                <tr key={permiso.idPermiso}>
                  <td>{permiso.tipo}</td>
                  <td>{permiso.concedidoText}</td>
                  <td>{permiso.claseText}</td>
                  <td>{permiso.objetivo}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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

export default PermisosForm;
