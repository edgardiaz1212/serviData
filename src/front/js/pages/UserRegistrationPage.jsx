import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalEditUser from "../component/ModalEditUser.jsx";

const UserRegistrationPage = () => {
  const { actions, store } = useContext(Context);
  const { users, isAuthenticated, user } = store;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted
    if (!isAuthenticated && isMounted) {
      navigate("/login", { replace: true }); // Use replace to avoid adding to history
    } else if (isMounted) {
      actions.fetchUserData(); // Fetch user data when the component mounts
    }

    return () => {
      isMounted = false; // Cleanup function to set the flag to false on unmount
    };
  }, []);

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

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    await actions.addUser(newUser);
    toast.success("User added successfully");
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

  return (
    <div className="container vh-100'">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <h1>Edita tus Datos</h1>
      <form className="m-3" onSubmit={handleEditCurrentUser}>
        <div className="container p-3">
          <div className="row ">
          <div className="col-6 ">
          <div>
            <label htmlFor="formUser" className="col-sm-5 col-form-label">
              Nombre de usuario:
            </label>
            <input
              className="form-control"
              id="formUser"
              type="text"
              value={currentUser.username}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: e.target.value })
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
                setCurrentUser({ ...currentUser, password: e.target.value })
              }
              required
            />
          </div>
          </div> 
          </div>
        </div>

        <button className="btn btn-primary m-2" type="submit">
          {"Guardar Cambios"}
        </button>
      </form>

      {user.role === "Admin" && (
        <>
          <h2>Agregar Usuario</h2>
          <form className="form-inline m-3" onSubmit={handleAddNewUser}>
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
              >
                <option value="User">Usuario</option>
                <option value="Admin">Administrador</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">
              Agregar
            </button>
          </form>

          <div className="container">
      <h2>Lista de Usuarios Registrados</h2>
      <div className="list-group list-group-horizontal"></div>
      <div className="row">
        <ul className="list-group w-50">
          {store.users.map((user, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{user.username} - {user.role}</span>
              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={() => handleEdit(user)}
              >
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
    </div>
  );
};

export default UserRegistrationPage;
