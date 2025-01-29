const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
		
		},
		actions: {
			// Use getActions to call a function within a function
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
						setStore({ user: data.user }); // Assuming the response contains user data
						return data;
					} else {
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
