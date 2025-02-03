import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { isAuthenticated, user } = store;

  const handleLogout = async () => {
    await actions.LogOut();
    navigate("/login"); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#001f3f" }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="/">
          ServiData
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {isAuthenticated && (
              <>
              <li className="nav-item">
                  <a className="nav-link text-white" href="/dashboard">
                    Resumen
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/clientes">
                    Clientes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/data-registro">
                    Registro
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/user-register">
                    Configuración
                  </a>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-white">Hola, {user ? user.username : 'Usuario'}!</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link text-white" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;