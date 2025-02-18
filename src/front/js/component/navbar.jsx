import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/CDHLogo.jpg"
import {Cog} from 'lucide-react'

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { isAuthenticated, user } = store;

  const handleLogout = async () => {
    await actions.LogOut();
    navigate("/"); // Redirect user to the login page after logging out
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#001f3f" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          ServiData
          <img  className="logo-icon " src={logo} alt="Logo" />
        </Link>
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
                  <Link className="nav-link text-white" to="/resumen">
                    Resumen
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/data-registro">
                    Registro
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/aprovisionados">
                    Aprovisionados
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/reportes">
                    Reportes
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-white">Hola, {user ? user.username : 'Usuario'}!</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user-register">
                  <Cog />
                  </Link>
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