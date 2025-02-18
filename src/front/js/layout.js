import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
//import { BackendURL } from "./component/backendURL"; // Ensure correct export
import "../styles/index.css";
import injectContext from "./store/appContext.js";
import Navbar from "./component/navbar"; // Ensure this path is correct
import Footer from "./component/footer"; // Ensure this path is correct
import Login from "./pages/login.jsx"; // Ensure this path is correct
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

const Layout = () => {
    const basename = process.env.REACT_APP_BASENAME_REACT || "";
    //const backendURL = process.env.REACT_APP_BACKEND_URL || ""; // Updated

    return (
        <div className="" style={{ backgroundColor: "#fffdfd" }}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/resumen" element={<Resumen/>} />
                        <Route path="/clientes" element={<Clientes />} /> 
                        <Route path="data-registro" element={<DataEntryPage/>} />
                        <Route path="/user-register" element={<UserRegistrationPage />} />
                        <Route path="consulta-clientes-registrados" element={<ConsultaClientesRegistrados/>} />
                        <Route path="/manual-data-entry" element={<ManualDataEntryPage />} /> "
                        <Route path='detalle-cliente/:clientId' element={<DetalleCliente />} />
                        <Route path='detalle-servicio/:serviceId' element={<DetalleServicio />} />
                        <Route path="/editar-servicio/:serviceId" element={<EditarServicio />} />
                        <Route path="/editar-cliente/:clientId" element={<EditarCliente />} />
                        <Route path="/aprovisionados" element={<Aprovisionados/>} />
                        <Route path="/reportes" element={<Reportes/>} />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
