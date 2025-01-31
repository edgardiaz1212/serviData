import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { LogIn } from 'lucide-react'; // Import LogIn from lucide-react

const Login = () => {
  const { actions, store } = useContext(Context);
  const { isAuthenticated } = store; // Assuming isAuthenticated is part of the context
  const navigate = useNavigate(); // Initialize useNavigate

  // Check authentication status after hooks
  if (isAuthenticated) {
    navigate("/dashboard", 2000); // Use navigate for redirection
    // return null; // Prevent rendering the login form
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await actions.login(username, password);
    if (response) {
      toast.success("Bienvenido!");
      navigate("/dashboard"); // Redirect to dashboard or perform other actions
    } else {
      toast.error("Error de Usuario");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="card p-4" style={{ width: "300px" }}>
      <h1 className="text-center font-bold text-gray-900">ServiData</h1>
      
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
          <button type="submit" className="btn btn-primary btn-block">
            <LogIn className="mr-2" /> Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
