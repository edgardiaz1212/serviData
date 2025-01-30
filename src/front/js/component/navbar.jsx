import React from 'react';


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#001f3f' }}>
            <a className="navbar-brand text-white" href="/">ServiData</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/clientes-publicos">Publicos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/clientes-privados">Privados</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/data-registro">Registro</a>
                        </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
