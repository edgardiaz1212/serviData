import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonDelete from "../component/ButtonDelete";
import ButtonSave from "../component/ButtonSave";

const EditarCliente = () => {
  const { clientId } = useParams();
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (store.user?.role !== "Admin") {
      navigate("/"); // Redirigir si el usuario no es admin
    } else {
      const fetchClientData = async () => {
        const client = await actions.getClientById(clientId);
        setClientData(client);
      };
      fetchClientData();
    }
  }, [clientId, actions, store.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const numericClientId = Number(clientId); // Convertir clientId a número
      if (isNaN(numericClientId)) {
        throw new Error("Invalid client ID. It must be a number.");
      }
      const result = await actions.updateClientData(
        numericClientId,
        clientData
      );
      if (result.error) {
        throw new Error(result.message);
      }
      toast.success("Cliente actualizado con éxito");
      setTimeout(() => {
        navigate(`/detalle-cliente/${clientId}`);
      }, 1500);
      
    } catch (error) {
      toast.error("Error al actualizar el cliente");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const numericClientId = Number(clientId); // Convertir clientId a número
      if (isNaN(numericClientId)) {
        throw new Error("Invalid client ID. It must be a number.");
      }
      const result = await actions.deleteClientAndServices(numericClientId);
      if (result.error) {
        throw new Error(result.message);
      }
      toast.success("Cliente y servicios eliminados con éxito");
      setTimeout(() => {
        navigate("/clientes");
      }, 1500);
      
    } catch (error) {
      toast.error("Error al eliminar el cliente y servicios");
      console.error(error);
    }
  };

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Editar Cliente</h2>
      <div className="mb-3">
        <label htmlFor="razon_social" className="form-label">
          Razón Social
        </label>
        <input
          type="text"
          className="form-control"
          id="razon_social"
          name="razon_social"
          value={clientData.razon_social}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rif" className="form-label">
          RIF
        </label>
        <input
          type="text"
          className="form-control"
          id="rif"
          name="rif"
          value={clientData.rif}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="validationTipo" className="form-label">
          Tipo
        </label>
        <select
          className="form-control"
          name="tipo"
          value={clientData.tipo}
          onChange={handleChange} // Asegúrate que handleChange maneje los cambios correctamente
          id="validationTipo"
          required
        >
          <option value="" disabled>
            Seleccione Tipo
          </option>
          <option value="Pública">Pública</option>
          <option value="Privada">Privada</option>
        </select>
      </div>
      <div className="d-flex gap-2">
        {" "}
        {/* Agrega d-flex y gap-2 (o el valor de gap que prefieras) */}
        <ButtonSave handleSave={handleSave} />
        <ButtonDelete handleDelete={handleDelete} />
      </div>
      <button
        className="btn btn-secondary mt-3 ms-2"
        onClick={() => navigate(`/detalle-cliente/${clientId}`)}
      >
        Regresar
      </button>
      <ToastContainer />
    </div>
  );
};

export default EditarCliente;
