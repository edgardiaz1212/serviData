import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const ModalDocumentLoad = ({ entityType, entityId, show, onClose }) => {
  const { store, actions } = useContext(Context);
  const [file, setFile] = useState(null); // Archivo seleccionado para subir
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [hasDocument, setHasDocument] = useState(false); // Indica si hay un documento cargado

  // Verificar si hay un documento cargado al abrir el modal
  useEffect(() => {
    const checkDocumentExists = async () => {
      try {
        const exists = await actions.checkDocumentExists(entityType, entityId);
        setHasDocument(exists);

      } catch (err) {
        setError("Failed to check document status");
        console.error(err);
      }
    };

    if (show) {
      checkDocumentExists();
    }
  }, [show, entityType, entityId]);

  // Manejar la selección de archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      await actions.uploadDocument(entityType, entityId, file);
      setFile(null);
      setHasDocument(true); // Actualizar el estado para indicar que hay un documento
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
      const url = await actions.downloadDocument(entityType, entityId);

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${entityId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download document");
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
      await actions.deleteDocument(entityType, entityId);
      setHasDocument(false); // Actualizar el estado para indicar que no hay un documento
      onClose(); // Cerrar el modal después de eliminar
    } catch (err) {
      setError("Failed to delete document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // No renderizar el modal si no está visible
  if (!show) return null;

  return (
    <div className="modal" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cargar Documento</h5>
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
                <p>Documento disponible:</p>
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
                  Subir Documento
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  onChange={handleFileChange}
                  disabled={loading}
                />
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
  );
};

export default ModalDocumentLoad;