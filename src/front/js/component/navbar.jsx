import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/CDHLogo.jpg";
import { Cog } from 'lucide-react';

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { isAuthenticated, user } = store;
  const [isBrandHovered, setIsBrandHovered] = useState(false);

  const handleLogout = async () => {
    await actions.LogOut();
    navigate("/"); // Redirect user to the home page after logging out
  };

  const shortBrandContent = <>PyP <strong className="text ms-1"> DCCE</strong></>;
  const longBrandContent = <>Planificación y Proyectos <strong className="text ms-1"> DCCE</strong></>;

  // Estilo para el enlace de la marca.
  // El minWidth asegura que el enlace tenga suficiente espacio para el texto más largo,
  // evitando que otros elementos del navbar se muevan.
  // Ajusta el valor de '320px' según sea necesario para tu diseño específico.
  const brandLinkStyle = {
    minWidth: '320px', // Ajusta este valor si es necesario
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-2">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={brandLinkStyle}
          onMouseEnter={() => setIsBrandHovered(true)}
          onMouseLeave={() => setIsBrandHovered(false)}
        >
          <img src={logo} alt="Logo" width="50" height="30" className="me-2" />
          {isBrandHovered ? longBrandContent : shortBrandContent}
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
              <li className="nav-item"> {/* Corregida la anidación incorrecta de <li> */}
                <Link className="nav-link" to="/projects"> {/* Asumiendo que el enlace es a /proyectos */}
                  Proyectos
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
