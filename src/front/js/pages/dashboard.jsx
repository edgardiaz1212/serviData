import React, { useEffect, useState, useContext } from 'react';


import { Context } from "../store/appContext";
import TipoServicios from '../component/TipoServicios.jsx';

const Dashboard = () => {
  const { actions } = useContext(Context)
  

  return (
  <>
    <div className="text-bg-light p-3">Bienvenido a la plataforma de servicios!</div>
    <div className='container'>





      <TipoServicios/>
    </div>
   </>
  );
};

export default Dashboard;
