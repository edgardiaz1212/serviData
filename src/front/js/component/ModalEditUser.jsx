import React, { useState, useEffect } from 'react';

const ModalEditUser = ({ user, show, handleClose, handleSave, handleDelete }) => {
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setUsername(user.username);
    setRole(user.role);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({ ...user, username, role, password });
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} id="exampleModal" style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!show}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de usuario:</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="Admin">Administrador</option>
                <option value="User">Usuario</option>
              </select>
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(user.id)}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditUser;