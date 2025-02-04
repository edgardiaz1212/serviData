const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state from session storage on load
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage

  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize with session storage value
      user: storedUser || null, // Initialize user state with stored user data
      users: [], // Add users state
      currentClient: [], // Add currentClient state
      clientData: [], // Add clientData state
      totalServices: 0, // Add totalServices state
      totalClients: 0, // Add totalClients state
      clientCountsByType: {},
      servicesCountsByType: {},
      topServices: [],
    },

    actions: {
      login: async (username, password) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ user: data.user, isAuthenticated: true });
            sessionStorage.setItem("isAuthenticated", "true"); // Store authentication state in session storage
            sessionStorage.setItem("user", JSON.stringify(data.user)); // Store user data in session storage
            console.log("Autenticado", data.user); // Update isAuthenticated
            return data;
          } else {
            setStore({ isAuthenticated: false }); // Set to false on login failure
            console.error("Login failed");
          }
        } catch (error) {
          console.log("Error during login", error);
        }
      },
      LogOut: async () => {
        const store = getStore;
        setStore({ user: null, isAuthenticated: false });
        sessionStorage.removeItem("isAuthenticated"); // Remove authentication state from session storage
        sessionStorage.removeItem("user"); // Remove user data from session storage
        console.log("User logged out");
      },

      addUser: async (user) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ users: [...store.users, data.user] });
            console.log("User added", data.user);
            return data;
          } else {
            console.error("Failed to add user");
          }
        } catch (error) {
          console.log("Error during user addition", error);
        }
      },
      editUser: async (userId, updatedUser) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          );
          if (response.ok) {
            const data = await response.json();
            const updatedUsers = store.users.map((user) =>
              user.id === userId ? data.user : user
            );
            setStore({ users: updatedUsers });
            console.log("User edited", data.user);
            return data;
          } else {
            console.error("Failed to edit user");
          }
        } catch (error) {
          console.log("Error during user editing", error);
        }
      },
      fetchUserData: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const loggedInUser = store.user;
            const filteredUsers = data.filter(user => user.id !== loggedInUser.id);
            setStore({ users: filteredUsers });
            console.log("Users data fetched", filteredUsers);
            return filteredUsers;
          } else {
            console.error("Failed to fetch users data");
          }
        } catch (error) {
          console.log("Error during fetching users data", error);
        }
      },
      deleteUser: async (userId) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const updatedUsers = store.users.filter(
              (user) => user.id !== userId
            );
            setStore({ users: updatedUsers });
            console.log("User deleted");
          }
        } catch (error) {
          console.log("Error during user deletion", error);
        }
      },
      addClientData: async (data) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/add_client`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to add client data");
          }
        } catch (error) {
          console.log("Error during adding client data", error);
        }
      },
      addServiceData: async (data) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/add_service`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to add service data");
          }
        } catch (error) {
          console.log("Error during adding service data", error);
        }
      },
      addClientAndServiceData: async (clientData, serviceData) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/client-and-services`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...clientData, ...serviceData }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to add client and service data");
          }
          const result = await response.json();
          console.log("Client and service data added successfully:", result);
        } catch (error) {
          console.error("Error adding client and service DATA:", error);
        }
      },

      fetchClientData: async (name) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/client-consult/${name}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching client data:", error);
          return [];
        }
      },
      fetchClientSuggestions: async (query) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/client-suggestions/?query=${query}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching client suggestions:", error);
          return [];
        }
      },
      getClientCountsByType: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/client-counts-by-type`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ clientCountsByType: data });
          } else {
            console.error("Failed to get client counts by type");
          }
        } catch (error) {
          console.log("Error during getting client counts by type", error);
        }
      },
      getServicebyClient: async (clientId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/${clientId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get service data");
          }
        } catch (error) {
          console.log("Error during getting service data", error);
        }
      },
      getServiceById: async (serviceId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/${serviceId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          }
        } catch (error) {
          console.log("Error during getting service data", error);
        }
      },
      getTopServices: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/top-services`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ topServices: data });
          } else {
            console.error("Failed to get top services");
          }
        } catch (error) {
          console.log("Error during getting top services", error);
        }
      },
      getTotalServices: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/total`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ totalServices: data.total });
          }
        } catch (error) {
          console.log("Error fetching total services", error);
        }
      },
      getTotalClients: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clientes/total`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ totalClients: data.total });
          }
        } catch (error) {
          console.log("Error fetching total clients", error);
        }
      },

      getClientById: async (clientId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clientes/${clientId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get client data");
          }
        } catch (error) {
          console.log("Error during getting client data", error);
        }
      },
      updateServiceData: async (serviceId, serviceData) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/${serviceId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(serviceData),
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          }
        } catch (error) {
          console.log("Error during updating service data", error);
        }
      },
      getClientbyTipo: async (tipo) => {
        const store = getStore;
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clients_tipo?tipo=${tipo}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ clientData: data });
            return data;
          } else {
            console.error("Failed to get client data");
          }
        } catch (error) {
          console.log("Error during getting client data", error);
        }
      },
      uploadExcelData: async (data) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/upload-excel`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          console.log("Data uploaded successfully:", result);
        } catch (error) {
          console.error("Error uploading data:", error);
        }
      },
      getServiceCountsByType: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-type`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ serviceCountsByType: data });
          } else {
            console.error("Failed to get service counts by type");
          }
        } catch (error) {
          console.log("Error during getting service counts by type", error);
        }
      },
      getClientServiceCounts: async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/service-counts-by-type`);
          if (response.ok) {
            const data = await response.json();
            setStore({ clientServiceCounts: data });
          } else {
            console.error("Failed to get client service counts");
          }
        } catch (error) {
          console.log("Error during getting client service counts", error);
        }
      },
    },
  };
};

export default getState;
