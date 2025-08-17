import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  ListGroup,
  Button,
  Dropdown,
  // ButtonGroup,
} from "react-bootstrap";
import {
  useFindDocumentQuery,
  useEventosDocumentoQuery,
  usePermisosQuery,
  useCerrarExpedienteMutation,
} from "../../services/subirArchivos.service";
import ExpedienteForm from "../../components/Archivos/expedienteForm";
import ArchivoForm from "../../components/Archivos/archivoForm";
import RenombrarForm from "../../components/Archivos/RenombrarForm";
import EliminarForm from "../../components/Archivos/EliminarForm";
import EventosForm from "../../components/Archivos/EventosForm";
import PermisosForm from "../../components/Archivos/PermisosForm";
import CerrarExpedienteForm from "../../components/Archivos/cerrarExpedienteForm";
import { downloadDocument } from "../../actions/downloadDocument";
import PdfPreview from "../../components/Archivos/PdfPreviewDocuments";
import Spinner from "../../components/Spinner";

const SubirArchivos = () => {
  
  const [currentPath, setCurrentPath] = useState([]);
  const [currentId, setCurrentId] = useState(
    "b6d0201b-64d3-4865-8161-22d4016671d1"
    //"ea836c6f-5bbb-41f9-95a5-e52a634cb5a2"
  );

  const { id } = useParams();
  const [idArchivo, setIdArchivo] = useState("50"); 
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState(null);

// Asegúrate de actualizar el estado correctamente cuando sea necesario.



  

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showExpedienteForm, setShowExpedienteForm] = useState(false);
  const [showArchivoForm, setShowArchivoForm] = useState(false);
  const [showEventosForm, setShowEventosForm] = useState(false);
  const [showRenombrarForm, setShowRenombrarForm] = useState(false);
  const [showEliminarForm, setShowEliminarForm] = useState(false);
  const [showPermisosForm, setShowPermisosForm] = useState(false);
  const [selectedNivel, setSelectedNivel] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isExpedienteSection, setIsExpedienteSection] = useState(false);
  const [isCarpetaExpediente, setIsCarpetaExpediente] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [isExpedienteCerrado, setIsExpedienteCerrado] = useState(false);
  const [cerrarExpediente] = useCerrarExpedienteMutation();
  const [showCerrarExpedienteForm, setShowCerrarExpedienteForm] = useState(false);


  const navigate = useNavigate();

  const {
    data: folderData,
    error: folderError,
    isLoading: folderLoading,
    refetch,
  } = useFindDocumentQuery({ idArchivo, id: currentId }); 
  const {
    data: eventosData,
    error: eventosError,
    isLoading: eventosLoading,
  } = useEventosDocumentoQuery(selectedDocument?.id, {
    skip: !showEventosForm || !selectedDocument,
  });
  const {
    data: permisosData,
    isLoading: permisosLoading,
    error: permisosError,
  } = usePermisosQuery(selectedDocument?.id, {
    skip: !showPermisosForm || !selectedDocument,
  });

  const handleExpedienteFormSave = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (folderLoading) return <Spinner />;
  if (folderError) return <div>Error al cargar los datos de la carpeta</div>;

  const handleRefreshClick = async () => {
    setLoadingRefresh(true); // Activa el spinner
    await refetch(); // Refresca los datos
    setLoadingRefresh(false); // Desactiva el spinner

    
  };

  // Si está cargando la data del folder
  if (folderLoading) return <Spinner />;

  if (folderError) return <div>Error al cargar los datos de la carpeta</div>;

  

  const handlePrint = async (folder) => {
    setSelectedDocument(folder);
    setLoadingPrint(true);

    try {
      const action = await dispatch(downloadDocument(folder.idDocumento));
      const { payload } = action;

      if (payload instanceof Blob) {
        const objectUrl = URL.createObjectURL(payload);

        // Crear un iframe pequeño y oculto para mostrar el PDF
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.border = "none";
        iframe.style.left = "-10000px";
        iframe.src = objectUrl;
        document.body.appendChild(iframe);

        // Esperar a que el PDF se cargue y luego imprimir
        iframe.onload = () => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          // Eliminar el iframe después de imprimir
          iframe.onload = () => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(objectUrl);
            setLoadingPrint(false);
          };
        };

        setLoadingPrint(false);
      } else {
        console.error("El documento descargado no es un Blob:", payload);
        setLoadingPrint(false);
      }
    } catch (error) {
      console.error("Error al cargar el documento para imprimir: ", error);
      setLoadingPrint(false);
    }
  };

  const handleDocumentClick = async (folder) => {
    setSelectedDocument(folder);
    setLoadingDocument(true);

    try {
      const action = await dispatch(downloadDocument(folder.idDocumento));
      const { payload } = action;

      if (payload instanceof Blob) {
        const objectUrl = URL.createObjectURL(payload);
        setPdfUrl(objectUrl);
        setShowModal(true);
      } else {
        console.error("El documento descargado no es un Blob:", payload);
      }
    } catch (error) {
      console.error("Error al abrir el documento: ", error);
    } finally {
      setLoadingDocument(false);
    }
  };


  const handleFolderClick = async (folderId, nivel, tipoDocumentoCustom) => {
    setLoading(true); // Activar spinner

    try {
        setCurrentPath([...currentPath, folderId]);
        setCurrentId(folderId);
        setSelectedNivel(nivel);

        setIsExpedienteSection(tipoDocumentoCustom === "Serie");
        setIsCarpetaExpediente(tipoDocumentoCustom === "Expediente");

        // Simulación de un retardo (elimina esto si no es necesario)
        await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
        console.error("Error al manejar la carpeta:", error);
    } finally {
        setLoading(false); // Desactivar spinner después de la acción
    }
};

  
  

const handleBackClick = async () => {
  setLoading(true); // Activar spinner

  const newPath = currentPath.slice(0, -1);
  setCurrentPath(newPath);
  const newCurrentId =
    newPath.length > 0
      ? newPath[newPath.length - 1]
      : "b6d0201b-64d3-4865-8161-22d4016671d1"; //"ea836c6f-5bbb-41f9-95a5-e52a634cb5a2";
  setCurrentId(newCurrentId);

  try {
    await refetch();

    const parentFolder =
      newPath.length > 0
        ? folderData.data.find(
            (folder) => folder.idDocumento === newPath[newPath.length - 1]
          )
        : null;

    if (parentFolder) {
      setIsExpedienteSection(parentFolder.tipoDocumentoCustom === "Serie");
      setIsCarpetaExpediente(
        folderData.data.some(
          (folder) => folder.tipoDocumentoCustom === "Expediente"
        )
      );
    } else {
      setIsExpedienteSection(false);
      setIsCarpetaExpediente(false);
    }

  } catch (error) {
    console.error("Error al manejar el retroceso:", error);
  } finally {
    setLoading(false); // Desactivar spinner después de la acción
  }
};

  // const handleExpedienteClick = (expediente) => {};



  const handleRenameClick = (document) => {
    setSelectedDocument(document);
    setShowRenombrarForm(true);
  };

  const handleDeleteClick = (document) => {
    if (document) {
      setSelectedDocument(document);
      setShowEliminarForm(true);
    }
  };
  const handleEventosClick = (document) => {
    if (document) {
      setSelectedDocument(document);
      setShowEventosForm(true);
    }
  };
  const handlePermisosClick = (document) => {
    if (document) {
      setSelectedDocument(document);
      setShowPermisosForm(true);
    }
  };

  const currentFolder = folderData ? folderData.data : [];

  const handleDownload = (documento) => {
    dispatch(downloadDocument(documento.idDocumento))
      .then((action) => {
        const { payload } = action;
        if (payload instanceof Blob) {
          const objectUrl = URL.createObjectURL(payload);
          // Crear un enlace de descarga y hacer clic en él
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = documento.documento;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
        } else {
          console.error("El documento descargado no es un Blob:", payload);
        }
      })
      .catch((error) => {
        console.error("Error al descargar el documento: ", error);
      });
  };

  const handleCerrarExpediente = async () => {
    try {
      if (!selectedDocument) {
        console.error("No hay expediente seleccionado para cerrar.");
        return;
      }

      const idDocumento = selectedDocument.idDocumento;

      const response = await cerrarExpediente({ idDocumento }).unwrap();

      console.log("Expediente cerrado exitosamente", response);
      setIsExpedienteCerrado(true);
      await refetch();
    } catch (error) {
      console.error("Error al cerrar expediente:", error);
    }
  };
  
  
  
  return (
    <Container style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outline-secondary"
          style={{
            marginBottom: "15px",
            color: currentPath.length > 0 ? "blue" : "gray",
            backgroundColor: currentPath.length > 0 ? "white" : "lightgray",
            border: "1.5px solid blue",
            marginRight: "10px",
          }}
          onClick={currentPath.length > 0 ? handleBackClick : null}
          disabled={currentPath.length === 0 || loading} // Deshabilitar si está cargando
        >
          
  {loading ? (
    <Spinner animation="border" size="sm" />
  ) : (
    <>
      <i className="bi bi-arrow-left"></i> Atrás
    </>
  )}
        </Button>
        <Button
          variant="outline-secondary"
          style={{
            marginBottom: "15px",
            color: "blue",
            marginRight: "10px",
            border: "none",
          }}
          onClick={() => navigate("/home")}
        >
          <i
            className="bi bi-house-door-fill"
            style={{ fontSize: "1.5rem" }}
          ></i>{" "}
        </Button>
        
        <Button
          variant="outline-secondary"
          style={{
            marginBottom: "15px",
            color: "blue",
            marginRight: "10px",
            border: "none",
          }}
          onClick={handleRefreshClick}
        >
          <div>
          <i className="bi bi-arrow-repeat" style={{ fontSize: "1.5rem" }}></i>
          </div>
        </Button>


        {(isExpedienteSection ||
          folderData.data.some(
            (folder) => folder.tipoDocumentoCustom === "Expediente"
          )) &&
          !isCarpetaExpediente && (
            <Button
              variant="outline-secondary"
              style={{
                marginBottom: "15px",
                color: "blue",
                backgroundColor: "white",
                border: "1.5px solid blue",
                marginRight: "10px",
              }}
              onClick={() => setShowExpedienteForm(true)}
            >
              <i className="bi bi-folder-plus"></i> Nuevo Expediente
            </Button>
          )}
        {isCarpetaExpediente && (
          <Button
            variant="outline-secondary"
            style={{
              marginBottom: "15px",
              color: "blue",
              backgroundColor: "white",
              border: "1.5px solid blue",
              marginRight: "10px",
            }}
            onClick={() => setShowArchivoForm(true)}
          >
            <i className="bi bi-upload"></i> Cargar Archivos
          </Button>
        )}
      </div>


      <ListGroup>
        {currentFolder.map((folder) =>
  folder.esCarpeta ? (
    <ListGroup.Item
      key={folder.idDocumento}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        color: "green",
      }}
    >
      
      
<div 
  onClick={() => handleFolderClick(folder.idDocumento, folder.idNivel, folder.tipoDocumentoCustom)}
  style={{ flexGrow: 1, cursor: "pointer", position: "relative" }}

>
  {loading && (
    
    // Si está cargando, muestra el spinner ocupando toda la pantalla
    <Spinner /> // Llama al componente Spinner que definiste

  )}

  {!loading && (
    // Si no está cargando, muestra el icono de la carpeta
    <>
      <i className="bi bi-folder-fill" style={{ marginRight: "10px" }}></i>
      {folder.documento || ""}
    </>
  )}
</div>



      <Dropdown align="end">
        <Dropdown.Toggle
          split
          variant="outline-secondary"
          id={`dropdown-folder-${folder.idDocumento}`}
          style={{ border: "none", color: "blue" }}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          
          <Dropdown.Item onClick={() => handleRenameClick(folder)}>
            <i className="bi bi-pencil-square" style={{ marginRight: "8px" }}></i> Renombrar
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleDeleteClick(folder)}>
            <i className="bi bi-trash" style={{ marginRight: "8px" }}></i> Eliminar
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleCerrarExpediente(folder)}>
          <i className="bi bi-lock" style={{ marginRight: "8px" }}></i> Cerrar Expediente
          </Dropdown.Item>  


        </Dropdown.Menu>

      </Dropdown>

      

    </ListGroup.Item>
  ) : (

            
            <ListGroup.Item
              key={folder.idDocumento}
              style={{
                cursor: "pointer",
                color: "blue",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{ flexGrow: 1 }}
                onClick={() => handleDocumentClick(folder)}
              >
                <i
                  className="bi bi-file-earmark-text"
                  style={{ marginRight: "10px" }}
                ></i>
                {folder.documento}
              </div>
              <Dropdown align="end">
                <Dropdown.Toggle
                  split
                  variant="outline-secondary"
                  id="dropdown-split-basic"
                  style={{ border: "none", color: "blue" }}
                />
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(folder);
                    }}
                  >
                    <i
                      className="bi bi-trash"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Eliminar
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePermisosClick(folder);
                    }}
                  >
                    <i
                      className="bi bi-shield-lock"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Permisos
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameClick(folder);
                    }}
                  >
                    <i
                      className="bi bi-pencil-square"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Renombrar
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventosClick(folder);
                    }}
                  >
                    <i
                      className="bi bi-calendar-event"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Eventos
                  </Dropdown.Item>

                  
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(folder);
                    }}
                  >
                    <i
                      className="bi bi-download"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Descargar
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePrint(folder)}>
                    <i
                      className="bi bi-printer"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Imprimir
                  </Dropdown.Item>

                  <Dropdown.Item onClick={() => handleCerrarExpediente(folder)}>
                  <i
                    className="bi bi-file-earmark-x"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Cerrar Expediente
                </Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
            </ListGroup.Item>
          )
        )}
      </ListGroup>
  
    
      <ExpedienteForm
        show={showExpedienteForm}
        onHide={() => {
          setShowExpedienteForm(false);
          handleExpedienteFormSave();
        }}
        idNivel={selectedNivel}
      />
      <ArchivoForm
        show={showArchivoForm}
        onHide={() => setShowArchivoForm(false)}
        idDocumentoPadre={currentId}
        refetch={refetch}
      />
      <RenombrarForm
        show={showRenombrarForm}
        onHide={() => setShowRenombrarForm(false)}
        document={selectedDocument}
        onSave={() => {
          refetch();
          setShowRenombrarForm(false);
        }}
      />
      <EliminarForm
        show={showEliminarForm}
        onHide={() => setShowEliminarForm(false)}
        document={selectedDocument || {}}
        refetch={refetch}
      />

      <EventosForm
        show={showEventosForm}
        onHide={() => setShowEventosForm(false)}
        document={selectedDocument?.id}
        eventosData={eventosData}
        isLoading={eventosLoading}
        error={eventosError}
      />
      <PermisosForm
        show={showPermisosForm}
        onHide={() => setShowPermisosForm(false)}
        permisos={permisosData?.data || []}
        loading={permisosLoading}
        error={permisosError}
      />
      <CerrarExpedienteForm 
        show={showCerrarExpedienteForm} 
        onHide={() => setShowCerrarExpedienteForm(false)} 
        expediente={selectedDocument || {}} 
        onSave={refetch} 
      />


      <PdfPreview
        showModal={showModal}
        setShowModal={setShowModal}
        pdfUrl={pdfUrl}
        titulo={selectedDocument?.documento}
      />
      {loadingPrint && <Spinner />}
      {loadingDocument && <Spinner />}
      {loadingRefresh && <Spinner />}
    </Container>
  );
};

export default SubirArchivos;
