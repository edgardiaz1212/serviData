const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state from session storage on load
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage

  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize with session storage value
      user: storedUser || null, // Initialize user state with stored user data
      users: [] // Add users state
    },

    actions: {
      login: async (username, password) => { 
        const store = getStore()
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
            sessionStorage.setItem("user", JSON.stringify(data.user)); // Store user data in session storage
            //localStorage.setItem("user", data.user)
            console.log("Autenticado", data.user); // Update isAuthenticated
            console.log("Autenticado data", data);
            return data;
          } else {
            setStore({ isAuthenticated: false }); // Set to false on login failure
            console.error('Login failed');
          }
        } catch (error) {
          console.log("Error during login", error);
        }
      },
      // Other actions...
    }
  };
};

export default getState;
