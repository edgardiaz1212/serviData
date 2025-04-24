import React from 'react';
import logo from '../../img/mad_data.png';
import { Server } from 'lucide-react'; // Using a server icon for the footer
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-secondary py-4 mt-auto"> 
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <Server className="h-6 w-6 me-2 text-light" />
              <span className="fs-5 fw-bold text-light">DCCE</span>
            </div>
            
            {/* Social Icons - Consider using Bootstrap Icons */}
            <a href="#" className="text-secondary mx-2">
            <img className="logo-icon" src={logo} alt="icon" width="90" />
            </a>
            
            <div className="small">
              © {currentYear}  Centro de Datos Clientes Externos. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;
