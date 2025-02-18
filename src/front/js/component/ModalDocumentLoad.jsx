import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const ModalDocumentLoad = ({ entityType, entityId, show, onClose }) => {
    const { store, actions } = useContext(Context);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      onClose();
    } catch (err) {
      setError("Failed to upload document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      
      const url = await actions.downloadDocument(entityType, entityId);
      setDocumentUrl(url);
      
      // Trigger download
      const link = document.createElement('a');
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

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      
      await actions.deleteDocument(entityType, entityId);
      setDocumentUrl(null);
      onClose();
    } catch (err) {
      setError("Failed to delete document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Document Management</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">
                Upload Document
              </label>
              <input
                type="file"
                className="form-control"
                id="fileInput"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {documentUrl && (
              <div className="mb-3">
                <p>Document is available</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={handleDownload}
                  disabled={loading}
                >
                  Download Document
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Document
                </button>
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
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDocumentLoad;
