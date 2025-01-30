import React from "react";

const ClientesPublicos = () => {
    return (
        <div>
            <h1>Clientes Públicos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Servicios</th>
                        <th>Cliente 1</th>
                        <th>Cliente 2</th>
                        <th>Cliente 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Servicio Web Básico</td>
                        <td>✔</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>E-commerce</td>
                        <td></td>
                        <td>✔</td>
                        <td>✔</td>
                    </tr>
                    <tr>
                        <td>Cloud Hosting</td>
                        <td>x3</td>
                        <td>x2</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>SEO Avanzado</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Marketing Digital</td>
                        <td>x2</td>
                        <td>x3</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Diseño UX/UI</td>
                        <td>✔</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Soporte Técnico</td>
                        <td>x5</td>
                        <td>x2</td>
                        <td>x4</td>
                    </tr>
                    <tr>
                        <td>Analítica Web</td>
                        <td>✔</td>
                        <td></td>
                        <td>x2</td>
                    </tr>
                    <tr>
                        <td>Gestión de Redes</td>
                        <td></td>
                        <td>x2</td>
                        <td>x3</td>
                    </tr>
                    <tr>
                        <td>Consultoría IT</td>
                        <td></td>
                        <td>✔</td>
                        <td>x2</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ClientesPublicos;
