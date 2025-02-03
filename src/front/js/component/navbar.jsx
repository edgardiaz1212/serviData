import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const context = useContext(Context);
  const { store, actions } = context || {}; // Safeguard against null context
  const { isAuthenticated, user } = store || {}; // Safeguard against undefined store
  const navigate = useNavigate();

  const handleLogout = async () => {
    await actions.LogOut();
    navigate("/login"); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#001f3f" }}
    >
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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {isAuthenticated && (
            <>
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
                  Configuracion
                </a>
              </li>
              <li className="nav-item">
                <span className="nav-link text-white">Hola, {user ? user.username : 'Usuario'}!</span>
              </li>
              <li className="nav-item" onClick={ handleLogout}>
                <a className="nav-link text-white" href="/">
                  logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
