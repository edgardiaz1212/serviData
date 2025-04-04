import React from 'react';
import logo from '../../img/mad_data.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-light text-dark py-3"> {/* Added some basic styling */}
            <div className="container d-flex justify-content-center align-items-center"> {/* Added container for better layout */}
                <p className='flex-grow-1 mb-0'>© {currentYear} ServiData •  </p> {/* Updated year here */}
                <img className="logo-icon" src={logo} alt="icon" width="90" />
            </div>
        </footer>
    );
};

export default Footer;
