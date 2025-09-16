// c:\Users\Edgar\Documents\GitHub\serviData\src\front\js\pages\UserRegistrationPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalEditUser from "../component/ModalEditUser.jsx";
import { User, Users, Pencil, Trash, Plus, Settings } from "lucide-react";
import "../../styles/userregistrationpage.css";

const UserRegistrationPage = () => {
  const { actions, store } = useContext(Context);
  const { isAuthenticated, user } = store; // isAuthenticated now comes from token presence
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("editCurrentUser");
  const [isLoading, setIsLoading] = useState(false); // Optional loading state

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (user?.role === "Admin" && selectedSection === "manageUsers") {
      // Fetch user data only if admin and viewing manage users section
      actions.fetchUserData().catch(error => {
          toast.error(`Error al cargar usuarios: ${error.message}`);
      });
    }
    // No need to fetch user data every time if it's already in store from login/session
  }, [isAuthenticated, navigate, user, selectedSection]); // Add dependencies

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "User", // Default role consistency
  });
  const [currentUserData, setCurrentUserData] = useState({ // Renamed to avoid conflict
    username: "",
    password: "", // Password field for *changing* password
    role: "",
  });

  // Update currentUserData when user object changes (e.g., after login or edit)
  useEffect(() => {
    if (user) {
      setCurrentUserData({
        username: user.username || "",
        password: "", // Always clear password field on load
        role: user.role || "",
      });
    }
  }, [user]);

  const isNewUserFormValid = () => { // Renamed for clarity
    return (
      newUser.username.trim() !== "" &&
      newUser.password.trim() !== "" &&
      newUser.role.trim() !== ""
    );
  };

   const isCurrentUserFormValid = () => {
    // Username must not be empty. Password can be empty (means no change).
    return currentUserData.username.trim() !== "";
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    if (!isNewUserFormValid()) {
      toast.error("Por favor, complete todos los campos para el nuevo usuario.");
      return;
    }
    setIsLoading(true);
    try {
      await actions.addUser(newUser);
      toast.success("Usuario agregado correctamente");
      setNewUser({ username: "", password: "", role: "User" }); // Reset form
      // Re-fetch user list if needed (or rely on flux update)
      if (user?.role === "Admin") {
          actions.fetchUserData();
      }
    } catch (error) {
      toast.error(`Error al agregar usuario: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCurrentUser = async (e) => {
    e.preventDefault();
     if (!isCurrentUserFormValid()) {
      toast.error("El nombre de usuario no puede estar vacío.");
      return;
    }
    setIsLoading(true);
    try {
      // Pass only the fields to update. Flux action handles empty password.
      const updatePayload = {
          username: currentUserData.username,
          role: currentUserData.role, // Include role if editable (usually not self-editable)
          ...(currentUserData.password && { password: currentUserData.password }) // Include password only if set
      };
      await actions.editUser(user.id, updatePayload);
      toast.success("Tus datos han sido actualizados!");
      // Clear password field after successful update
      setCurrentUserData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      toast.error(`Error al editar tus datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOtherUser = (userToEdit) => { // Renamed for clarity
    setEditingUser(userToEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => { // Renamed for clarity
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveChangesModal = async (updatedUser) => { // Renamed for clarity
    setIsLoading(true);
    try {
      await actions.editUser(updatedUser.id, updatedUser);
      toast.success("Usuario editado con éxito!");
      setShowModal(false);
      setEditingUser(null);
       // Re-fetch user list if needed (or rely on flux update)
       if (user?.role === "Admin") {
          actions.fetchUserData();
      }
    } catch (error) {
      toast.error(`Error al guardar cambios: ${error.message}`);
      // Keep modal open on error? Or close? Depends on UX preference.
      // setShowModal(false);
      // setEditingUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => { // Renamed for clarity
    if (userId === user?.id) { // Check against potentially null user
      toast.error("No puedes eliminar tu propio usuario.");
      return;
    }
    // Confirmation dialog
    if (!window.confirm(`¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.`)) {
        return;
    }

    setIsLoading(true);
    try {
      await actions.deleteUser(userId);
      toast.success("Usuario eliminado con éxito!");
      setShowModal(false); // Close modal if delete was initiated from there
      setEditingUser(null);
      // Re-fetch user list
       if (user?.role === "Admin") {
          actions.fetchUserData();
      }
    } catch (error) {
      toast.error(`Error al eliminar usuario: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
     // Fetch users if switching to manage users section and is admin
    if (section === "manageUsers" && user?.role === "Admin") {
        actions.fetchUserData().catch(error => {
            toast.error(`Error al cargar usuarios: ${error.message}`);
        });
    }
  };

  // Render logic remains similar, but ensure forms use the correct state variables
  // (newUser for adding, currentUserData for editing self)
  // Add disabled={isLoading} to buttons during async operations.

  return (
    <div className="container user-registration-page">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <h1 className="mb-3 d-flex align-items-center page-title">
        <Settings size={30} className="me-2" />
        Configuración
      </h1>
      <p className="mb-4 page-description">
        Gestiona tu perfil y, si eres administrador, los usuarios del sistema.
      </p>

      {/* Section Selection Tabs/Buttons */}
      <div className="section-selector mb-4">
        <button
          className={`section-tab btn ${selectedSection === "editCurrentUser" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => handleSectionChange("editCurrentUser")}
        >
          <User size={20} className="me-1" /> Mis Datos
        </button>
        {user?.role === "Admin" && (
          <button
            className={`section-tab btn ${selectedSection === "manageUsers" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => handleSectionChange("manageUsers")}
          >
            <Users size={20} className="me-1" /> Gestionar Usuarios
          </button>
        )}
      </div>


      {/* Edit Current User Section */}
      {selectedSection === "editCurrentUser" && user && ( // Check if user exists
        <div className="card mb-4">
          <div className="card-header">
             <h2 className="h5 mb-0 d-flex align-items-center">
                <Pencil size={20} className="me-2" />
                Editar Mis Datos
             </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleEditCurrentUser} className="needs-validation" noValidate>
              <div className="mb-3">
                <label htmlFor="currentUsername" className="form-label">Nombre de usuario:</label>
                <input
                  id="currentUsername"
                  type="text"
                  className="form-control"
                  value={currentUserData.username}
                  onChange={(e) => setCurrentUserData({ ...currentUserData, username: e.target.value })}
                  required
                  disabled={isLoading}
                />
                 <div className="invalid-feedback">Por favor ingresa un nombre de usuario.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="currentPassword">Nueva Contraseña (dejar en blanco para no cambiar):</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="form-control"
                  placeholder="********"
                  value={currentUserData.password}
                  onChange={(e) => setCurrentUserData({ ...currentUserData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>
               {/* Role is usually not self-editable, display it */}
               <div className="mb-3">
                   <label className="form-label">Rol:</label>
                   <input
                       type="text"
                       className="form-control"
                       value={currentUserData.role}
                       readOnly
                       disabled
                   />
               </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !isCurrentUserFormValid()}
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Other Users Section (Admin Only) */}
      {selectedSection === "manageUsers" && user?.role === "Admin" && (
        <>
          {/* Add New User Form */}
          <div className="card mb-4">
             <div className="card-header">
                <h2 className="h5 mb-0 d-flex align-items-center">
                    <Plus size={20} className="me-2" />
                    Agregar Nuevo Usuario
                </h2>
             </div>
             <div className="card-body">
                <form onSubmit={handleAddNewUser} className="row g-3 align-items-end needs-validation" noValidate>
                    <div className="col-md-4">
                        <label htmlFor="newUsername" className="form-label">Nombre de Usuario</label>
                        <input
                            id="newUsername"
                            type="text"
                            className="form-control"
                            placeholder="usuario"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                         <div className="invalid-feedback">Campo requerido.</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="newPassword">Contraseña</label>
                        <input
                            id="newPassword"
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                         <div className="invalid-feedback">Campo requerido.</div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="newRole">Rol</label>
                        <select
                            id="newRole"
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            required
                            disabled={isLoading}
                        >
                            <option value="User">Usuario</option>
                            <option value="Admin">Administrador</option>
                        </select>
                         <div className="invalid-feedback">Selecciona un rol.</div>
                    </div>
                    <div className="col-md-1 d-flex align-items-end">
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={isLoading || !isNewUserFormValid()}
                        >
                            {isLoading ? "..." : <Plus size={18}/>}
                        </button>
                    </div>
                </form>
             </div>
          </div>


          {/* User List */}
           <div className="card">
             <div className="card-header">
                <h2 className="h5 mb-0 d-flex align-items-center">
                    <Users size={20} className="me-2" />
                    Usuarios Registrados
                </h2>
             </div>
             <div className="card-body p-0"> {/* Remove padding for full-width list */}
                 {isLoading && !store.users.length ? (
                     <p className="text-center p-3">Cargando usuarios...</p>
                 ) : !store.users.length ? (
                     <p className="text-center p-3">No hay otros usuarios registrados.</p>
                 ) : (
                    <ul className="list-group list-group-flush">
                        {store.users.map((otherUser) => ( // Renamed loop variable
                        <li
                            key={otherUser.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>
                            <strong>{otherUser.username}</strong> ({otherUser.role})<br />
                            <small>Última conexión: {otherUser.last_login ? new Date(otherUser.last_login).toLocaleString('es-ES') : 'Nunca'}</small>
                            </span>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditOtherUser(otherUser)}
                                    disabled={isLoading}
                                    title="Editar Usuario"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteUser(otherUser.id)}
                                    disabled={isLoading || otherUser.id === user?.id} // Disable delete for self
                                    title="Eliminar Usuario"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </li>
                        ))}
                    </ul>
                 )}
             </div>
           </div>

          {/* Edit User Modal */}
          {editingUser && (
            <ModalEditUser
              user={editingUser}
              show={showModal}
              handleClose={handleCloseModal}
              handleSave={handleSaveChangesModal}
              handleDelete={handleDeleteUser} // Pass delete handler if modal has delete button
              isLoading={isLoading} // Pass loading state to modal
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserRegistrationPage;
