const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isAuthenticated: false, // Add isAuthenticated state
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
						setStore({ user: data.user, isAuthenticated: true }); // Update isAuthenticated
						return data;
					} else {
						setStore({ isAuthenticated: false }); // Set to false on login failure
						console.error('Login failed');
					}
				} catch (error) {
					console.log("Error during login", error);
				}
			},
		}
	};
};

export default getState;
