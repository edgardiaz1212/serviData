import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalEditUser from "../component/ModalEditUser.jsx";
import { User, Users, Pencil, Trash, Plus, Settings, PackagePlus, Package, FileEdit } from "lucide-react"; // Import icons
import "../../styles/userregistrationpage.css"

const UserRegistrationPage = () => {
  const { actions, store } = useContext(Context);
  const { isAuthenticated, user } = store;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("editCurrentUser");
  const [servicePlans, setServicePlans] = useState([]);
  const [newServicePlan, setNewServicePlan] = useState({
    service_name: "",
    tier_size: "S",
    price: 0,
    description: "",
  });

  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated && isMounted) {
      navigate("/login", { replace: true });
    } else if (isMounted) {
      actions.fetchUserData();
      if (user && user.role === "Admin") {
        fetchServicePlans();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchServicePlans = async () => {
    try {
      const response = await fetch("/api/service-plans"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch service plans");
      }
      const data = await response.json();
      setServicePlans(data);
    } catch (error) {
      console.error("Error fetching service plans:", error);
      toast.error("Error fetching service plans");
    }
  };

  const handleAddServicePlan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/service-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newServicePlan),
      });
      if (!response.ok) {
        throw new Error("Failed to add service plan");
      }
      toast.success("Service plan added successfully");
      setNewServicePlan({
        service_name: "",
        tier_size: "S",
        price: 0,
        description: "",
      });
      fetchServicePlans(); // Refresh the list
    } catch (error) {
      console.error("Error adding service plan:", error);
      toast.error("Error adding service plan");
    }
  };

  const handleEditServicePlan = async (plan) => {
    try {
      const response = await fetch(`/api/service-plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });
      if (!response.ok) {
        throw new Error("Failed to edit service plan");
      }
      toast.success("Service plan edited successfully");
      fetchServicePlans(); // Refresh the list
    } catch (error) {
      console.error("Error editing service plan:", error);
      toast.error("Error editing service plan");
    }
  };

  const handleDeleteServicePlan = async (planId) => {
    try {
      const response = await fetch(`/api/service-plans/${planId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete service plan");
      }
      toast.success("Service plan deleted successfully");
      fetchServicePlans(); // Refresh the list
    } catch (error) {
      console.error("Error deleting service plan:", error);
      toast.error("Error deleting service plan");
    }
  };

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setCurrentUser({
        username: user.username,
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const isFormValid = () => {
    return (
      newUser.username.trim() !== "" &&
      newUser.password.trim() !== "" &&
      newUser.role.trim() !== ""
    );
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }
    await actions.addUser(newUser);
    toast.success("Usuario agregado correctamente");
    setNewUser({ username: "", password: "", role: "user" });
  };

  const handleEditCurrentUser = async (e) => {
    e.preventDefault();
    await actions.editUser(user.id, currentUser);
    toast.success("Usuario editado con éxito!");
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = async (updatedUser) => {
    await actions.editUser(updatedUser.id, updatedUser);
    toast.success("Usuario editado con éxito!");
    setShowModal(false);
  };

  const handleDelete = async (userId) => {
    if (userId === user.id) {
      toast.error("No puedes eliminar tu propio usuario.");
      return;
    }
    await actions.deleteUser(userId);
    toast.success("Usuario eliminado con éxito!");
    setShowModal(false);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Page Title and Description */}
      <h1 className=" mb-3 d-flex align-items-center ">
        <Settings size={30} className="me-2" />
        Configuración
      </h1>
      <p className=" mb-4">
        Aquí puedes gestionar la información de Servidata.
      </p>

      {/* Section Selection Table */}
      <table className="table table-borderless">
        <tbody>
          <tr>
            <td
              className={`text-center section-cell ${
                selectedSection === "editCurrentUser" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("editCurrentUser")}
            >
              <User size={48} className="mx-auto" color={selectedSection === "editCurrentUser" ? "#007bff" : "currentColor"} />
              <p className="mt-2">Editar tus Datos</p>
            </td>
            {user && user.role === "Admin" && (
              <>
                <td
                  className={`text-center section-cell ${
                    selectedSection === "manageUsers" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("manageUsers")}
                >
                  <Users size={48} className="mx-auto" color={selectedSection === "manageUsers" ? "#007bff" : "currentColor"}/>
                  <p className="mt-2">Gestionar Usuarios</p>
                </td>
                <td
                  className={`text-center section-cell ${
                    selectedSection === "manageServicePlans" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("manageServicePlans")}
                >
                  <Package size={48} className="mx-auto" color={selectedSection === "manageServicePlans" ? "#007bff" : "currentColor"}/>
                  <p className="mt-2">Gestionar Planes</p>
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>

      {/* Edit Current User Section */}
      {selectedSection === "editCurrentUser" && (
        <>
          <h2 className="text-center mb-3">
            <Pencil size={24} className="me-2" />
            Edita tus Datos
          </h2>
          <div className="d-flex justify-content-center">
            <form className="m-3 w-50" onSubmit={handleEditCurrentUser}>
              <div className="container p-3">
                <div className="row">
                  <div className="col-12">
                    <div>
                      <label
                        htmlFor="formUser"
                        className="col-sm-5 col-form-label"
                      >
                        Nombre de usuario:
                      </label>
                      <input
                        className="form-control"
                        id="formUser"
                        type="text"
                        value={currentUser.username}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="formPassword">Contraseña:</label>
                      <input
                        className="form-control"
                        id="formPassword"
                        type="password"
                        value={currentUser.password}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button className="btn btn-primary m-2" type="submit">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Manage Other Users Section */}
      {selectedSection === "manageUsers" && user && user.role === "Admin" && (
        <>
          <h2 className="text-center mb-3">
            <Plus size={24} className="me-2" />
            Agregar Usuario
          </h2>
          <div className="d-flex justify-content-center">
            <form className="form-inline m-3 w-50" onSubmit={handleAddNewUser}>
              <div className="form-group mx-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de Usuario"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group mx-2">
                <input
                  className="form-control"
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group mx-2">
                <select
                  className="custom-select mr-sm-2"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  required
                >
                  <option value="User">Usuario</option>
                  <option value="Admin">Administrador</option>
                </select>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success m-2"
                  disabled={!isFormValid()}
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>

          <div className="container">
            <h2 className="text-center mb-3">
              <Users size={24} className="me-2" />
              Lista de Usuarios Registrados
            </h2>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-50">
                {store.users.map((user, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {user.username} - {user.role}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {editingUser && (
              <ModalEditUser
                user={editingUser}
                show={showModal}
                handleClose={handleClose}
                handleSave={handleSave}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </>
      )}
      {/* Manage Service Plans Section */}
      {selectedSection === "manageServicePlans" && user && user.role === "Admin" && (
        <>
          <h2 className="text-center mb-3">
            <PackagePlus size={24} className="me-2" />
            Agregar Plan de Servicio
          </h2>
          <div className="d-flex justify-content-center">
            <form className="m-3 w-50" onSubmit={handleAddServicePlan}>
              <div className="mb-3">
                <label htmlFor="serviceName" className="form-label">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="serviceName"
                  value={newServicePlan.service_name}
                  onChange={(e) =>
                    setNewServicePlan({
                      ...newServicePlan,
                      service_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tierSize" className="form-label">
                  Tamaño del Plan
                </label>
                <select
                  className="form-select"
                  id="tierSize"
                  value={newServicePlan.tier_size}
                  onChange={(e) =>
                    setNewServicePlan({
                      ...newServicePlan,
                      tier_size: e.target.value,
                    })
                  }
                  required
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Precio
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={newServicePlan.price}
                  onChange={(e) =>
                    setNewServicePlan({
                      ...newServicePlan,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={newServicePlan.description}
                  onChange={(e) =>
                    setNewServicePlan({
                      ...newServicePlan,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success m-2">
                  Agregar Plan
                </button>
              </div>
            </form>
          </div>

          <div className="container">
            <h2 className="text-center mb-3">
              <FileEdit size={24} className="me-2" />
              Lista de Planes de Servicio
            </h2>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-75">
                {servicePlans.map((plan) => (
                  <li
                    key={plan.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{plan.service_name} - {plan.tier_size}:</strong> ${plan.price}
                      <p>{plan.description}</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleEditServicePlan(plan)}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteServicePlan(plan.id)}
                      >
                        <Trash size={16} />
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRegistrationPage;
