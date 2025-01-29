import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
//import { BackendURL } from "./component/backendURL"; // Ensure correct export

import injectContext from "../store/appContext.js";
import Navbar from "./component/navbar"; // Ensure this path is correct
import Footer from "./component/footer"; // Ensure this path is correct
import Login from "../pages/login"; // Ensure this path is correct
import Dashboard from "../pages/dashboard"; // Ensure this path is correct

const Layout = () => {
    const basename = process.env.REACT_APP_BASENAME_REACT || "";
    //const backendURL = process.env.REACT_APP_BACKEND_URL || ""; // Updated

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
