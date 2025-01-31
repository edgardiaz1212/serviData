const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state from session storage on load
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize with session storage value
      user: null, // Initialize user state
      users: [] // Add users state
    },
    actions: {
      login: async (username, password) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          if (response.ok) {
            const data = await response.json();
            setStore({ user: data.user, isAuthenticated: true });
            sessionStorage.setItem("isAuthenticated", "true"); // Store authentication state in session storage
            console.log("Autenticado"); // Update isAuthenticated
            return data;
          } else {
            setStore({ isAuthenticated: false }); // Set to false on login failure
            console.error('Login failed');
          }
        } catch (error) {
          console.log("Error during login", error);
        }
      },
      addUser: async (userData) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          if (response.ok) {
            const newUser = await response.json();
            setStore({ users: [...getStore().users, newUser] }); // Update users state
          }
        } catch (error) {
          console.error('Error adding user:', error);
        }
      },
      editUser: async (userId, userData) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          if (response.ok) {
            const updatedUser = await response.json();
            const users = getStore().users.map(user => user.id === userId ? updatedUser : user);
            setStore({ users }); // Update users state
          }
        } catch (error) {
          console.error('Error editing user:', error);
        }
      },
    }
  };
};

export default getState;
