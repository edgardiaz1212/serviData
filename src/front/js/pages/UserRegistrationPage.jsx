import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserEditModal from "../component/UserEditModal"; // Import the modal

const UserRegistrationPage = () => {
  const { actions, store } = useContext(Context);
  const { users, isAuthenticated, user } = store;
  const navigate = useNavigate();

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
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    if (user) {
      setCurrentUser({ username: user.username, password: "", role: user.role });
    }
  }, [user]);

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    await actions.addUser(newUser);
    toast.success("User added successfully");
    setNewUser({ username: "", password: "", role: "user" });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.editUser(user.id, currentUser);
    toast.success("Usuario editado con éxito!");
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setCurrentUser({ username: user.username, password: "", role: user.role });
    setEditingUser(user);
    setShowModal(true); // Open the modal
  };

  const handleClose = () => setShowModal(false); // Close the modal

  const handleSave = async (updatedUser) => {
    await actions.editUser(updatedUser.id, updatedUser);
    toast.success("Usuario editado con éxito!");
    setShowModal(false); // Close the modal after saving
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
     
      <h1>Edita tus Datos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="formUser" className="col-sm-2 col-form-label">
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
        <button className="btn btn-primary m-2" type="submit">
          {"Guardar Cambios"}
        </button>
      </form>

      {user.role === "Admin" && (
        <>
           <h2>Agregar Usuario</h2>
      <form className="form-inline" onSubmit={handleAddNewUser}>
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
        <button type="submit" className="btn btn-primary">
          Agregar
        </button>
      </form>
          
          <h2>Lista de Usuarios Registrados</h2>
          {users.map((user) => (
            <form key={user.id} className="form-inline">
              <div className="form-group mx-2">
                <input
                  type="text"
                  className="form-control m-2"
                  value={user.username}
                  readOnly={true}
                />
              </div>
              <div className="form-group mx-2">
                <input
                  type="text"
                  className="form-control"
                  value={user.role}
                  readOnly={true}
                />
              </div>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => handleEdit(user)}
              >
                Editar
              </button>
            </form>
          ))}
          <UserEditModal
            user={user.username}
            show={showModal}
            handleClose={handleClose}
            handleSave={handleSave}
          />
        </>
      )}
    </div>
  );
};

export default UserRegistrationPage;
