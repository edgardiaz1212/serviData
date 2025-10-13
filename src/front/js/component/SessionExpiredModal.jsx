import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const SessionExpiredModal = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleAccept = () => {
    actions.LogOut();
    navigate("/login");
  };

  if (!store.sessionExpired) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sesión Expirada</h5>
          </div>
          <div className="modal-body">
            <p>Su sesión ha expirado. Por favor, inicie sesión nuevamente.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleAccept}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
