// src/front/js/pages/Home.jsx

import React, { useContext, useEffect } from 'react';
import { ArrowRight, BarChart2, Database, Server, Shield, Users, ShieldCheck } from 'lucide-react';
import { Context } from '../store/appContext';
// Removed unused import 'work' as it wasn't used in the provided code.
// import work from '../../img/work.png'

export default function DCCELandingPage() {
  const { actions, store } = useContext(Context);

  useEffect(() => {
    // Fetch data only if it's not already in the store to avoid unnecessary calls
    if (!store.totalClients) {
      actions.getTotalClients();
    }
    if (!store.totalServices) {
      actions.getTotalServices();
    }
    // The actions and store objects from flux are generally stable,
    // so they don't usually need to be in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures this runs only once when the component mounts

  // Determine the correct link and button text based on authentication status
  const accessLink = store.isAuthenticated ? "/resumen" : "/login";
  const accessButtonText = store.isAuthenticated ? "Ir al Resumen" : "Acceder";
  const accessServidataButtonText = store.isAuthenticated ? "Ir al Resumen" : "Acceder a Servidata";

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <header className="bg-primary text-white">
        <div className="container py-5">
          {/* Bootstrap Navbar specific to Home.jsx */}
          <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5">
            <div className="container-fluid px-0">
              <a className="navbar-brand d-flex align-items-center" href="#">
                <Server className="h-8 w-8 me-2" />
                <span className="fs-5 fw-bold">Planificación y Proyectos DCCE</span>
              </a>
              {/* Hamburger button - Show only if NOT authenticated */}
              {!store.isAuthenticated && (
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              )}
              <div className="collapse navbar-collapse" id="navbarNav">
                {/* Show these links only if NOT authenticated */}
                {!store.isAuthenticated && (
                  <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                    <li className="nav-item">
                      <a className="nav-link" href="#servicios">Servicios</a>
                    </li>
                                       <li className="nav-item">
                      <a className="nav-link" href="#contacto">Contacto</a>
                    </li>
                  </ul>
                )}
                {/* Conditional Access button */}
                <a
                  href={accessLink} // Use the conditional link
                  className={`btn btn-info ${store.isAuthenticated ? 'ms-auto' : 'ms-md-3'}`} // Adjust margin if authenticated
                >
                  {accessButtonText} {/* Use the conditional text */}
                </a>
              </div>
            </div>
          </nav>

          {/* Rest of the component remains the same... */}
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3">Centro de Datos Clientes Externos</h1>
              <p className="fs-5 mb-4">
                Planificación y gestión integral de proyectos para infraestructura de datos empresariales
              </p>
              <div className="d-flex gap-3">
                <a
                  href="#contacto"
                  className="btn btn-outline-light fw-bold py-2 px-4"
                >
                  Contactar
                </a>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <div className="bg-primary-subtle p-4 rounded-3 shadow">
                <div className="row g-3 text-center">
                  <div className="col-6"><Server className="h-16 w-16 text-primary" /></div>
                  <div className="col-6"><Database className="h-16 w-16 text-primary" /></div>
                  <div className="col-6"><Shield className="h-16 w-16 text-primary" /></div>
                  <div className="col-6"><BarChart2 className="h-16 w-16 text-primary" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Servicios Section */}
      <section id="servicios" className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-5 text-dark">Nuestros Servicios</h2>
          <div className="row g-4">
            {/* Service Card 1 */}
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <Server className="h-12 w-12 text-primary mb-3" />
                  <h3 className="fs-5 fw-bold mb-2 card-title">Infraestructura de Datos</h3>
                  <p className="card-text text-muted">
                    Soluciones de almacenamiento y procesamiento de datos adaptadas a las necesidades específicas de cada cliente.
                  </p>
                </div>
              </div>
            </div>
            {/* Service Card 2 */}
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <Shield className="h-12 w-12 text-primary mb-3" />
                  <h3 className="fs-5 fw-bold mb-2 card-title">Seguridad y Compliance</h3>
                  <p className="card-text text-muted">
                    Protección integral de datos con estándares de seguridad avanzados y cumplimiento normativo.
                  </p>
                </div>
              </div>
            </div>
            {/* Service Card 3 */}
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <BarChart2 className="h-12 w-12 text-primary mb-3" />
                  <h3 className="fs-5 fw-bold mb-2 card-title">Análisis y Estadísticas</h3>
                  <p className="card-text text-muted">
                    Herramientas de visualización y análisis para optimizar el rendimiento y tomar decisiones basadas en datos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema Servidata Section */}
      <section id="servidata" className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="fw-bold mb-3 text-dark">Sistema Servidata</h2>
              <p className="text-muted mb-4">
                Una plataforma integral para el registro de clientes y gestión de servicios contratados en nuestro centro de datos.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="d-flex align-items-center text-muted mb-2">
                  <span className="me-2 text-primary fw-bold">✓</span>
                  Registro detallado de clientes empresariales
                </li>
                <li className="d-flex align-items-center text-muted mb-2">
                  <span className="me-2 text-primary fw-bold">✓</span>
                  Seguimiento de servicios contratados en tiempo real
                </li>
                <li className="d-flex align-items-center text-muted mb-2">
                  <span className="me-2 text-primary fw-bold">✓</span>
                  Estadísticas y reportes personalizados
                </li>
                <li className="d-flex align-items-center text-muted">
                  <span className="me-2 text-primary fw-bold">✓</span>
                  Panel de control intuitivo y fácil de usar
                </li>
              </ul>
              {/* Conditional Servidata Access button */}
              <a
                href={accessLink} // Use the conditional link
                className="btn btn-primary btn-lg shadow d-inline-flex align-items-center"
              >
                {accessServidataButtonText} {/* Use the conditional text */}
                <ArrowRight className="ms-2 h-5 w-5" />
              </a>
            </div>

            <div className="col-md-6">
              {/* Mockup Card */}
              <div className="card bg-dark text-light shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center py-2">
                  <div className="d-flex gap-2">
                    <span className="d-inline-block rounded-circle bg-danger" style={{ width: '12px', height: '12px' }}></span>
                    <span className="d-inline-block rounded-circle bg-warning" style={{ width: '12px', height: '12px' }}></span>
                    <span className="d-inline-block rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></span>
                  </div>
                  <small className="text-muted">servidata.dcce.com</small>
                </div>
                <div className="card-body p-4">
                  <div className="bg-secondary p-3 rounded mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-info font-monospace">Sistema Servidata</div>
                      <Database className="h-5 w-5 text-info" />
                    </div>
                    <div className="bg-dark p-3 rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-light small">Clientes activos:</span>
                        <span className="text-success fw-bold">{store.totalClients || 0}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-light small">Servicios contratados:</span>
                        <span className="text-success fw-bold">{store.totalServices || 0}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-light small">Uso de recursos:</span>
                        {/* This value seems static, update if dynamic data is available */}
                        <span className="text-info fw-bold">78%</span>
                      </div>
                    </div>
                  </div>
                  {/* Removed the commented-out login button inside the card */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de confianza Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="h2 fw-bold mb-4">Protección y Confianza en Cada Proyecto</h2>
              <p className="fs-5">
                Nuestros servicios de centro de datos cuentan y cumplen con los más altos estándares de seguridad de la industria.
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <ShieldCheck size={90} />
              {/* Removed the img tag as it wasn't used */}
            </div>
          </div>
        </div>
      </section>


      {/* Contacto Section */}
      <section id="contacto" className="py-1 bg-dark text-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-1">Contáctenos</h2>
          <div className="row">
             <div className="col-md-12  mb-md-0"> {/*cambiar a col-md-6 al usar enviar mensaje*/}

              <h3 className="fs-5 fw-bold mb-3">Centro de Datos Clientes Externos</h3>
              <p className=" mb-2">
                Estamos comprometidos en proporcionar la mejor experiencia a nuestros clientes.
                Contáctenos para obtener más información sobre nuestros servicios o para resolver cualquier duda.
              </p>
              {/* Contact Info Items */}
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <span>+58 212 9060200</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <span>copyp_cdh@cantv.com.ve</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <span>Calle A Las cabañas. Av Principal del Hatillo. Sector La Boyera. Edificio Cantv Caracas Venezuela</span>
              </div>
            </div>
            {/* <div className="col-md-6">
              
              <form>
                <div className="mb-3">
                  <label className="form-label small fw-bold" htmlFor="name">
                    Nombre
                  </label>
                  <input
                    className="form-control bg-secondary text-light border-secondary"
                    id="name"
                    type="text"
                    placeholder="Su nombre"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold" htmlFor="email">
                    Correo electrónico
                  </label>
                  <input
                    className="form-control bg-secondary text-light border-secondary"
                    id="email"
                    type="email"
                    placeholder="su@email.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold" htmlFor="message">
                    Mensaje
                  </label>
                  <textarea
                    className="form-control bg-secondary text-light border-secondary"
                    id="message"
                    rows="5"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                <div className="d-grid">
                  
                  <button
                    className="btn btn-primary fw-bold"
                    type="button"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form> 
          </div>*/}
            </div>
        </div>
      </section>
    </div>
  );
}
