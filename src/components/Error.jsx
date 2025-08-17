import React from "react";
import { Alert } from "react-bootstrap";

const Error = ({ message }) => (
  <Alert variant="danger" dismissible>
    <i className="bi bi-exclamation-triangle flex-shrink-0 me-2"></i>
    {message}
  </Alert>
);

export default Error;
