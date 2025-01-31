import React, { useState } from 'react';

const UserEditModal = ({ user, show, handleClose, handleSave }) => {
    const [username, setUsername] = useState(user ? user.username : '');
    const [role, setRole] = useState(user ? user.role : '');

    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave({ ...user, username, role, password });
        handleClose();
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Usuario</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
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
                                <input
                                    type="text"
                                    className="form-control"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
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
                </div>
            </div>
        </div>

    );
};

export default UserEditModal;
