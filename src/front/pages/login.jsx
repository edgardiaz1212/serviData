import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';

const Login = () => {
    const { actions } = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await actions.login(username, password);
        if (response) {
            alert('Login successful!');
            // Redirect to dashboard or perform other actions
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '300px' }}>
                <h2 className="text-center">Bienvenido a ServiData</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de usuario:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Ingresar</button>
                </form>
                <p className="text-center"><a href="/forgot-password">¿Olvidaste tu contraseña?</a></p>
                <p className="text-center"><a href="/register">Crear nueva cuenta</a></p>
            </div>
        </div>
    );
};

export default Login;
