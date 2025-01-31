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
    },
  };
};

export default getState;
