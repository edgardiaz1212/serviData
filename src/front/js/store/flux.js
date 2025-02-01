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
        const store = getStore
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
            setStore({ users: data }); // Update the store with the fetched users data
            console.log("Users data fetched", data);
            return data;
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
      fetchClientData: async (name) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/client-consult/?name=${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
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
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/client-suggestions/?query=${query}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching client suggestions:", error);
          return [];
        }
      },

      addClientData : async (data) => {
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
      addServiceData : async (data) => {
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
      getServicebyClient : async (clientId) => {
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

      
    },
  };
};

export default getState;