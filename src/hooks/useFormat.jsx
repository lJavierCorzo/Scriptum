export const useFormat = () => {
    const formatDate = (dateString) =>
      dateString ? `${dateString.split('-')[2]}/${dateString.split('-')[1]}/${dateString.split('-')[0]}` : '';
  
    const documentosEnPaginaActual = (currentPage, elementsPerPage, documentos) =>
      documentos.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage);
  
    return { formatDate, documentosEnPaginaActual };
  };
  