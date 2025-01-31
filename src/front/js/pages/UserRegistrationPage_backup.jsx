import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserRegistrationPage = () => {
    const { actions, store } = useContext(Context);
    const { users, isAuthenticated, user } = store; // Assuming userRole is part of the context
    const navigate = useNavigate();
    console.log("del store ",user)
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login',1000);
        }
    }, [isAuthenticated, navigate]);

    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const [editingUser, setEditingUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            await actions.editUser(editingUser.id, newUser);
            toast.success('Usuario editado con éxito!');
        } else {
            await actions.addUser(newUser);
            toast.success('Usuario añadido con éxito!');
        }
        setNewUser({ username: '', password: '', role: 'user' });
        setEditingUser(null);
    };

    const handleEdit = (user) => {
        setNewUser({ username: user.username, password: '', role: user.role });
        setEditingUser(user);
    };

    return (
        <div className='container'>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
            <h1>Edita tus Datos</h1>
            
            {user.role === 'Admin' && (
            <><h1>Registro de Usuarios</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                </div>
                {user.role === 'Admin' && (
                    <div>
                        <label>Rol:</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="User">Usuario</option>
                            <option value="Admin">Administrador</option>
                        </select>
                    </div>
                )}
                <button type="submit">{editingUser ? 'Editar Usuario' : 'Añadir Usuario'}</button>
            </form>
            <h2>Lista de Usuarios</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} 
                        {user.role === 'Admin' && (
                            <button onClick={() => handleEdit(user)}>Editar</button>
                        )}
                    </li>
                ))}
            </ul>
            </>)}
        </div>
    );
};

export default UserRegistrationPage;
