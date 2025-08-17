import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SeverPagination = ({
  data,
  currentPage,
  totalElements,
  elementsPerPage,
  onPageChange,
  onElementsPerPageChange,
  maxPageNumbers = 10,
}) => {
  if (!(data?.length > 0 || totalElements > 0)) {
    return <></>;
  }

  const totalPages = elementsPerPage > 0 ? Math.ceil(totalElements / elementsPerPage) : 1;
  let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage < maxPageNumbers - 1) {
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const firstRecord = (currentPage - 1) * elementsPerPage + 1;
  const lastRecord = Math.min(currentPage * (elementsPerPage > 0 ? elementsPerPage : totalElements), totalElements);

  const handleElementsPerPageChange = (event) => {
    const newElementsPerPage = parseInt(event.target.value, 10);
    onPageChange(1);
    onElementsPerPageChange(newElementsPerPage);
  };

  const goToFirstPage = () => {
    onPageChange(1);
  };

  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="d-flex flex-sm-row flex-column align-items-sm-center justify-content-end">
      <div className="me-3 mt-4 mb-0">
        Mostrando {firstRecord} a {lastRecord} de {totalElements} registros
      </div>
      <nav>
        <ul className="pagination mt-4 mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button className="page-link" onClick={goToFirstPage} disabled={currentPage === 1}>
              &laquo;
            </Button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              Anterior
            </Button>
          </li>

          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <Button className="page-link" onClick={() => onPageChange(number)}>
                {number}
              </Button>
            </li>
          ))}

          <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
            <Button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
              Siguiente
            </Button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <Button className="page-link" onClick={goToLastPage} disabled={currentPage === totalPages}>
              &raquo;
            </Button>
          </li>
        </ul>
      </nav>
      <div className="ms-md-3 mt-4 mt-md-0">
        <Form.Label htmlFor="elementsPerPageSelect">Elementos por página:</Form.Label>
        <Form.Select id="elementsPerPageSelect" value={elementsPerPage} onChange={handleElementsPerPageChange}>
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="1000">1000</option>
          <option value="-1">Todos</option>
        </Form.Select>
      </div>
    </div>
  );
};

export default SeverPagination;
