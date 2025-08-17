import React from "react";
import { Modal } from "react-bootstrap";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const PdfPreviewDocuments = ({ showModal, setShowModal, pdfUrl, titulo }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} fullscreen centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="text-primary">{titulo}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
      </Modal.Body>
    </Modal>
  );
};

export default PdfPreviewDocuments;
