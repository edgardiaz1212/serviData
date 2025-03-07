import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalDocumentLoad = ({ entityType, entityId, show, onClose }) => {
  const { store, actions } = useContext(Context);
  const [file, setFile] = useState(null); // Archivo seleccionado para subir
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [hasDocument, setHasDocument] = useState(false); // Indica si hay un documento cargado
  const [documentId, setDocumentId] = useState(null);
  
  // Verificar si hay un documento cargado al abrir el modal
  useEffect(() => {
    const checkDocumentExists = async () => {
        try {
            const exists = await actions.checkDocumentExists(entityType, entityId);
            setHasDocument(exists);
        } catch (err) {
            setError("Error al verificar el estado del documento");
            toast.error("Error al verificar el estado del documento");
            console.error(err);
        }
    };
    if (show) {
        checkDocumentExists();
    }
}, [show, entityType, entityId]);

 // Manejar la selección de archivo
 const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    // Verificar el tamaño del archivo (límite de 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. El tamaño máximo es 10MB.");
      toast.error("El archivo es demasiado grande");
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  }
};

  // Manejar la carga del documento
  const handleUpload = async () => {
    if (!file) {
        setError("Please select a file to upload");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const formData = new FormData();
        formData.append('file', file);
        await actions.uploadDocument(entityType, entityId, formData);

        setFile(null);
        setHasDocument(true); // Actualizar el estado para indicar que hay un documento
        toast.success("Documento cargado exitosamente", {
            autoClose: 3000
        });

        onClose(); // Cerrar el modal después de cargar
    } catch (err) {
        setError("Failed to upload document");
        console.error(err);
    } finally {
        setLoading(false);
    }
};

  // Manejar la descarga del documento
  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
        await actions.downloadDocument(store.documentId, entityType === "client");
        toast.success("Documento descargado exitosamente", {
            autoClose: 3000
        });
    } catch (err) {
        setError("Error al descargar el documento");
        toast.error("Error al descargar el documento");
        console.error(err);
    } finally {
        setLoading(false);
    }
};

  // Manejar la eliminación del documento
  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
        await actions.deleteDocument(store.documentId, entityType === "client");
        setHasDocument(false); // Actualizar el estado para indicar que no hay un documento
        toast.success("Documento eliminado exitosamente");
        onClose(); // Cerrar el modal después de eliminar
    } catch (err) {
        setError("Error al eliminar el documento");
        toast.error("Error al eliminar el documento");
        console.error(err);
    } finally {
        setLoading(false);
    }
};

  // No renderizar el modal si no está visible
  if (!show) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {entityType === "client" ? "Documento del Cliente" : "Documento del Servicio"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {/* Mostrar opciones según si hay un documento cargado */}
              {hasDocument ? (
                <div>
                  <p>Documento disponible: <strong>{store.documentName}</strong></p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleDownload}
                      disabled={loading}
                    >
                      Descargar Documento
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      Eliminar Documento
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="fileInput" className="form-label">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <small className="text-muted mt-1 d-block">
                    Tamaño máximo: 10MB. Formatos soportados: PDF, DOCX, XLSX
                  </small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cerrar
              </button>
              {!hasDocument && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={loading || !file}
                >
                  {loading ? "Subiendo..." : "Subir"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDocumentLoad;
