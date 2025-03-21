import React from 'react';
import logo from '../../img/mad_data.png';

const Footer = () => {
    return (
        <footer>
           <div className="d-flex justify-content-center align-items-center">
            <p className='flex-grow-1'>© 2025 ServiData •  </p>
            <img className="logo-icon" src={logo} alt="icon" width="70" />
        </div>
        </footer>
    );
};
export default Footer;
