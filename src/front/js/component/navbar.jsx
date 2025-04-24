import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/CDHLogo.jpg";
import { Cog } from 'lucide-react';

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { isAuthenticated, user } = store;

  const handleLogout = async () => {
    await actions.LogOut();
    navigate("/"); // Redirect user to the home page after logging out
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-2">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" width="50" height="30" className="me-2" />
          Planificación y Proyectos <strong className="text-warning"> DCCE</strong>
        </Link>

        {/* Hamburger menu toggle button - Conditionally rendered */}
        {isAuthenticated && ( // Only show the button if the user is authenticated
          <button
            className="navbar-toggler "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* Always show these links if authenticated */}
          {isAuthenticated && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/resumen">
                  Resumen
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clientes">
                  Clientes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/registro">
                  Registro
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/aprovisionados">
                  Aprovisionados
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reportes">
                  Reportes
                </Link>
              </li>
            </ul>
          )}

          {/* Always show user info/logout if authenticated */}
          {isAuthenticated && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link">
                  Hola, {user ? user.username : 'Usuario'}!
                </span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/user-register">
                  <Cog size={18} />
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Salir
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
