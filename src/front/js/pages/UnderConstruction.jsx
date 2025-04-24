// src/front/js/pages/UnderConstruction.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import { HardHat } from 'lucide-react'; // Using a construction-related icon

// Make sure Bootstrap CSS is imported in your project's entry point
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function UnderConstruction() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-center p-4">
      <HardHat size={80} className="text-warning mb-4" strokeWidth={1.5} />
      <h1 className="display-4 fw-bold text-secondary mb-3">
        ¡Sitio en Construcción!
      </h1>
      <p className="fs-5 text-muted mb-4">
        Estamos trabajando duro para traerte algo increíble. <br />
        Vuelve pronto para ver las novedades.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Volver al Inicio
      </Link>
      
    </div>
  );
}
