import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import "../styles/index.css";
import injectContext from "./store/appContext.js";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import Login from "./pages/login.jsx";
import Resumen from "./pages/Resumen.jsx"
import DataEntryPage from "./pages/DataEntryPage.jsx";
import UserRegistrationPage from "./pages/UserRegistrationPage.jsx";
import ManualDataEntryPage from "./pages/ManualDataEntryPage.jsx";
import Clientes from "./pages/Clientes.jsx";
import ConsultaClientesRegistrados from "./pages/ConsultaClientesRegistrados.jsx";
import DetalleCliente from "./pages/DetalleCliente.jsx";
import EditarServicio from "./pages/EditarServicio.jsx";
import DetalleServicio from "./pages/DetalleServicio.jsx";
import EditarCliente from "./pages/EditarCliente.jsx";
import Aprovisionados from "./pages/Aprovisionados.jsx";
import Reportes from "./pages/Reportes.jsx";
import NotFound from "./pages/NotFound.jsx";
import DCCELandingPage from "./pages/Home.jsx";
import UnderConstruction from "./pages/UnderConstruction.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import EditProjectPage from "./pages/EditProjectPage.jsx";

const Layout = () => {
    const basename = process.env.REACT_APP_BASENAME_REACT || "";

    return (
        <div className="app-container" style={{ backgroundColor: "#fffdfd", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="content-container" style={{ flexGrow: 1 }}>
                        <Routes>
                            <Route path="/underconstruction" element={<UnderConstruction />} />
                            <Route path='' element={<DCCELandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/resumen" element={<Resumen />} />
                            <Route path="/clientes" element={<Clientes />} />
                            <Route path="registro" element={<DataEntryPage />} />
                            <Route path="/user-register" element={<UserRegistrationPage />} />
                            <Route path="consulta-clientes-registrados" element={<ConsultaClientesRegistrados />} />
                            <Route path="/manual-data-entry" element={<ManualDataEntryPage />} />
                            <Route path='detalle-cliente/:clientId' element={<DetalleCliente />} />
                            <Route path='detalle-servicio/:serviceId' element={<DetalleServicio />} />
                            <Route path="/editar-servicio/:serviceId" element={<EditarServicio />} />
                            <Route path="/editar-cliente/:clientId" element={<EditarCliente />} />
                            <Route path="/aprovisionados" element={<Aprovisionados />} />
                            <Route path="/reportes" element={<Reportes />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/projects/new" element={<EditProjectPage />} />
                            <Route path="/projects/:id" element={<ProjectDetailPage />} />
                            <Route path="/projects/:id/edit" element={<EditProjectPage />} />
                            <Route path="/*" element={<NotFound />} />
                        </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
