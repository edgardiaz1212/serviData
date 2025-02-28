import React, { useContext, useEffect } from 'react'
import { Context } from '../store/appContext'
import { useNavigate } from 'react-router-dom'


function Reportes() {
  const { store } = useContext(Context)
  const { isAuthenticated } = store
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <>

   
    <div className="container">
    <h1>Reportes</h1>
    
    <div className="row justify-content-between">
    <div className="col-auto">
    <h3>Clientes</h3>
    <p>Clientes activos</p>
    <p>Clientes Publica</p>
    <p>Clientes Privada</p>
    </div>
    <div className="col-auto">
    <h3>Servicios</h3>
    <p>Servicios activos</p>
    <p>Servicios Publica</p>
    <p>Servicios Privada</p>
    <p>Servicios retirados por mes</p>
    <p> Servicios aprovisionados por mes en curso</p>
    <p> Servicios aprovisionados por mes</p>
    <p> Servicios aprovisionados por ano</p>
    </div>
    </div>
</div>
    </>
  )
}

export default Reportes
