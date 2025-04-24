// src/front/js/pages/login.jsx
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, Server } from "lucide-react"; // Importa los iconos necesarios
import "../../styles/login.css"; // Asegúrate que la ruta es correcta

const Login = () => {
  const { actions, store } = useContext(Context);
  const { isAuthenticated } = store;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // No mostramos toast aquí, ya que se muestra en handleSubmit
      navigate("/resumen", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback visual

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Inicia feedback
    try {
      const response = await actions.login(username, password);
      if (response) {
        toast.success("¡Bienvenido!");
        // La redirección ya ocurre en el useEffect
      } else {
        // El error específico debería venir del action si es posible
        toast.error("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ocurrió un error al intentar iniciar sesión.");
    } finally {
      setIsLoading(false); // Termina feedback
    }
  };

  // Si ya está autenticado, no renderizar el formulario
  if (isAuthenticated) {
    return null; // O un componente de carga/redirección
  }

  return (
    <>
      {/* Contenedor principal para centrar */}
      <div className="login-page-container d-flex justify-content-center align-items-center min-vh-100">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // 'light', 'dark', or 'colored'
        />

        {/* Tarjeta de Login */}
        <div className="login-card bg-white p-4 p-md-5 rounded shadow-sm">
          {/* Encabezado */}
          <div className="text-center mb-4">
            <Server size={40} className="text-primary mb-2" />
            <h1 className="h3 mb-3 fw-normal">Acceso ServiData</h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Campo Usuario */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingUsername"
                placeholder="nombre.usuario" // Placeholder es útil aunque la etiqueta flote
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading} // Deshabilitar mientras carga
              />
              <label htmlFor="floatingUsername">
                <User size={16} className="me-1 align-text-bottom" />
                Nombre de usuario
              </label>
            </div>

            {/* Campo Contraseña */}
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading} // Deshabilitar mientras carga
              />
              <label htmlFor="floatingPassword">
                <Lock size={16} className="me-1 align-text-bottom" />
                Contraseña
              </label>
            </div>

            {/* Botón de Ingreso */}
            <button
              className="w-100 btn btn-lg btn-primary d-flex align-items-center justify-content-center"
              type="submit"
              disabled={isLoading} // Deshabilitar mientras carga
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <LogIn size={20} className="me-2" />
              )}
              Ingresar
            </button>

            {/* Opcional: Enlace "¿Olvidó contraseña?" */}
            {/* <div className="text-center mt-3">
              <a href="#" className="text-muted small">¿Olvidó su contraseña?</a>
            </div> */}

          </form>
           <p className="mt-4 mb-1 text-muted text-center small">
              &copy; {new Date().getFullYear()} ServiData
            </p>
        </div>
      </div>
    </>
  );
};

export default Login;
