const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state AND token from session storage on load
  const storedToken = sessionStorage.getItem("jwt_token");
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const isAuthenticated = !!storedToken; // Is authenticated if token exists

  // Helper function to get headers with Authorization token for JSON requests
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("jwt_token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Helper function to handle fetch responses, including 401
  const handleApiResponse = async (response) => {
    if (response.status === 401) {
      // Unauthorized: Token is invalid or expired
      console.error("Unauthorized access (401). Logging out.");
      getActions().LogOut(); // Call logout action
      // Optionally redirect to login page here or let components handle it
      throw new Error("Unauthorized"); // Throw error to stop further processing
    }
    if (!response.ok) {
      // Handle other errors
      const errorData = await response.json().catch(() => ({})); // Try to parse error JSON
      console.error(
        `API Error ${response.status}:`,
        errorData.message || errorData.error || response.statusText // Check for 'error' key too
      );
      throw new Error(errorData.message || errorData.error || `HTTP error ${response.status}`);
    }
    // For 204 No Content or similar success responses without body
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return null; // Or return { success: true } or similar
    }
    try {
        return await response.json(); // Parse JSON for successful responses with body
    } catch (e) {
        // Handle cases where response is OK but body is not valid JSON
        console.error("Failed to parse JSON response:", e);
        throw new Error("Invalid JSON response from server");
    }
  };

  // Construct the base API URL
  const API_URL = process.env.REACT_APP_BACKEND_URL + "/api" // Add /api prefix
  console.log("API URL being used:", API_URL);
  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize based on token presence
      user: storedUser || null,
      users: [],
      currentClient: [],
      clientData: [],
      totalServices: 0,
      totalClients: 0,
      clientCountsByType: {},
      serviceCountsByType: {},
      serviceCountsByClientType: {},
      topServices: [],
      newServicesCurrentMonth: [],
      newServicesLastMonth: [],
      aprovisionados: [],
      activeServiceCount: 0,
      documentName: [],
      documentId: null,
      serviceCountsByPlatform: [],
      newServicesMonthlyTrend: [],
    },

    actions: {
      // ==============================
      // Autenticación
      // ==============================
      login: async (username, password) => {
        try {
          const response = await fetch(
            `${API_URL}/login`, // Use API_URL
            {
              method: "POST",
              headers: { // No auth header needed for login
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            }
          );
          // Login response needs specific handling (check for token)
          if (response.ok) {
            const data = await response.json();
            if (data.access_token && data.user) { // Check if token and user are present
                // Store token and user data
                sessionStorage.setItem("jwt_token", data.access_token);
                sessionStorage.setItem("user", JSON.stringify(data.user));
                setStore({ user: data.user, isAuthenticated: true });
                console.log("Login successful. Token stored.");
                return data; // Return data including token and user
            } else {
                // Handle case where login is OK but response format is wrong
                console.error("Login response missing token or user data:", data);
                getActions().LogOut();
                throw new Error("Login failed: Invalid server response.");
            }
          } else {
             // Handle specific login failure (e.g., 401 Invalid Credentials)
             const errorData = await response.json().catch(() => ({}));
             console.error("Login failed:", errorData.message || response.statusText);
             getActions().LogOut(); // Ensure clean state on failure
             throw new Error(errorData.message || "Invalid credentials");
          }
        } catch (error) {
          console.error("Error during login:", error);
          getActions().LogOut(); // Ensure clean state on error
          throw error; // Re-throw error for component handling
        }
      },

      LogOut: () => {
        // Clear token and user data from storage and store
        sessionStorage.removeItem("jwt_token");
        sessionStorage.removeItem("user");
        setStore({ user: null, isAuthenticated: false });
        console.log("User logged out. Token removed.");
        // Optionally redirect to login page here using react-router-dom's navigate
      },

      // ==============================
      // Gestión de Usuarios
      // ==============================
addUser: async (user) => {
        try {
          console.log("addUser called with user object:", user);
          const response = await fetch(
            `${API_URL}/users`,
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(user),
            }
          );
          const data = await handleApiResponse(response);
          console.log(data);
          if (data && data.user) {
             const store = getStore();
             setStore({ users: [...store.users, data.user] });
             console.log("User added", data.user);
             return data;
          }
        } catch (error) {
          console.error("Error during user addition:", error);
          throw error;
        }
      },

      editUser: async (userId, updatedUser) => {
        try {
          const payload = { ...updatedUser };
          if (!payload.password) {
            delete payload.password;
          }
          const response = await fetch(
            `${API_URL}/users/${userId}`,
            {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify(payload),
            }
          );
          const data = await handleApiResponse(response);
          if (data && data.user) {
            const store = getStore();
            const updatedUsers = store.users.map((user) =>
              user.id === userId ? data.user : user
            );
            setStore({ users: updatedUsers });
            if (store.user && store.user.id === userId) {
                setStore({ user: data.user });
                sessionStorage.setItem("user", JSON.stringify(data.user));
            }
            console.log("User edited", data.user);
            return data;
          }
        } catch (error) {
          console.error("Error during user editing:", error);
          throw error;
        }
      },

      fetchUserData: async () => {
        try {
          const token = sessionStorage.getItem("jwt_token");
          if (!token) {
            console.error("No token found");
            return [];
          }
      
          const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const data = await handleApiResponse(response);
      
          if (Array.isArray(data)) {
            const store = getStore();
            const loggedInUser = store.user;
            const filteredUsers = loggedInUser ? data.filter(user => user.id !== loggedInUser.id) : data;
            setStore({ users: filteredUsers });
            return filteredUsers;
          }
      
          return [];
      
        } catch (error) {
          console.error("Error during fetching users data:", error);
          return [];
        }
      },

      deleteUser: async (userId) => {
         try {
          const response = await fetch(
            `${API_URL}/users/${userId}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(), // Use JSON headers even for DELETE if backend expects/handles it
            }
          );
          // Handle potential 204 No Content before calling handleApiResponse's JSON parsing
          if (response.status === 204) {
              console.log("User deleted successfully (204)");
              const store = getStore();
              const updatedUsers = store.users.filter((user) => user.id !== userId);
              setStore({ users: updatedUsers });
              return { message: "User deleted successfully" };
          }
          // Use handleApiResponse for other cases (200 OK with body, 401, other errors)
          const data = await handleApiResponse(response);
          const store = getStore();
          const updatedUsers = store.users.filter((user) => user.id !== userId);
          setStore({ users: updatedUsers });
          console.log("User deleted");
          return data || { message: "User deleted successfully" }; // Return parsed data or default message

        } catch (error) {
          console.error("Error during user deletion:", error);
          throw error;
        }
      },

      // ==============================
      // Clientes
      // ==============================
      addClientData: async (clientPayload) => {
        try {
          const response = await fetch(
            `${API_URL}/add_client/`, // Note the trailing slash if your backend requires it
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(clientPayload),
            }
          );
          const data = await handleApiResponse(response);
          // Optionally update state if needed, e.g., refetch client list
          return data;
        } catch (error) {
          console.error("Error during adding client data:", error);
          throw error;
        }
      },

      fetchClientData: async (name = "") => { // Default name to empty string
        try {
          const response = await fetch(
            `${API_URL}/client-consult/?name=${encodeURIComponent(name)}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects an array
          // setStore({ clientData: data || [] }); // Optionally update store
          return data || [];
        } catch (error) {
          console.error("Error fetching client data:", error);
          return [];
        }
      },

      fetchClientSuggestions: async (query) => {
        try {
          const response = await fetch(
            `${API_URL}/client-suggestions/?query=${encodeURIComponent(query)}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects an array
          return data || [];
        } catch (error) {
          console.error("Error fetching client suggestions:", error);
          return [];
        }
      },

      getClientCountsByType: async () => {
        try {
          const response = await fetch(
            `${API_URL}/client-counts-by-type`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects an object
          setStore({ clientCountsByType: data || {} });
          return data || {};
        } catch (error) {
          console.log("Error during getting client counts by type", error);
          setStore({ clientCountsByType: {} }); // Reset on error
          return {};
        }
      },

      getTotalClients: async () => {
        try {
          const response = await fetch(
            `${API_URL}/clientes/total`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects { total: number }
          setStore({ totalClients: data?.total || 0 });
          return data?.total || 0;
        } catch (error) {
          console.log("Error fetching total clients", error);
          setStore({ totalClients: 0 });
          return 0;
        }
      },

      getClientById: async (clientId) => {
        try {
          const response = await fetch(
            `${API_URL}/clientes/${clientId}`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects client object
          // setStore({ currentClient: data }); // Optionally update store
          return data;
        } catch (error) {
          console.log("Error during getting client data by ID:", error);
          throw error;
        }
      },

      getClientbyTipo: async (tipo) => {
        try {
          const response = await fetch(
            `${API_URL}/clients_tipo?tipo=${encodeURIComponent(tipo)}`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects array
          setStore({ clientData: data || [] });
          return data || [];
        } catch (error) {
          console.log("Error during getting client data by type:", error);
          setStore({ clientData: [] });
          return [];
        }
      },

      updateClientData: async (clientId, clientData) => {
        if (!clientId || typeof clientId !== "number" || !clientData || typeof clientData !== "object" || Object.keys(clientData).length === 0) {
            console.error("Invalid input for updateClientData");
            throw new Error("Invalid input for updating client data.");
        }
        try {
          const response = await fetch(
            `${API_URL}/clients/${clientId}`, // Backend uses /clients/:id for PUT
            {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify(clientData),
            }
          );
          const data = await handleApiResponse(response); // Expects updated client object
          // Optionally update store if needed (e.g., if clientData list is stored)
          console.log("Client updated successfully:", data);
          return { success: true, data };
        } catch (error) {
          console.error("Error during updating client data:", error.message);
          return { success: false, message: error.message }; // Return error object
        }
      },

      deleteClientAndServices: async (clientId) => {
        if (!clientId || typeof clientId !== "number") {
            console.error("Invalid input for deleteClientAndServices");
            throw new Error("Invalid client ID.");
        }
        try {
          const response = await fetch(
            `${API_URL}/clients/${clientId}`, // Backend uses /clients/:id for DELETE
            {
              method: "DELETE",
              headers: getAuthHeaders(), // Send auth header
            }
          );
           // Handle potential 204 No Content before calling handleApiResponse's JSON parsing
          if (response.status === 204) {
              console.log("Client and services deleted successfully (204)");
              // Optionally update store (e.g., remove client from a list)
              return { success: true, message: "Client and associated services deleted successfully" };
          }
          const data = await handleApiResponse(response); // Expects { message: "..." } on 200 OK
          // Optionally update store
          return { success: true, message: data?.message || "Deleted successfully" };
        } catch (error) {
          console.error("Error during deleting client and services:", error.message);
          return { success: false, message: error.message };
        }
      },

      // ==============================
      // Servicios
      // ==============================
      addServiceData: async (servicePayload) => {
        try {
          const response = await fetch(
            `${API_URL}/add_service/`, // Note the trailing slash
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(servicePayload),
            }
          );
          const data = await handleApiResponse(response); // Expects { message: "...", service: {...} }
          // Optionally update state
          return data;
        } catch (error) {
          console.log("Error during adding service data", error);
          throw error;
        }
      },

      getServicebyClient: async (clientId) => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-by-cliente/${clientId}`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects { message: "...", services: [...] }
          const services = data?.services || [];
          const activeServices = services.filter(
            (service) => service.estado_servicio !== "Retirado"
          );
          setStore({ activeServiceCount: activeServices.length });
          return services; // Return the full list
        } catch (error) {
          console.error("Error during getting service data by client:", error);
          setStore({ activeServiceCount: 0 }); // Reset count on error
          throw error;
        }
      },

      getServicesByClientType: async (clientType) => {
        try {
          const response = await fetch(
            `${API_URL}/services_by_client_type/${encodeURIComponent(clientType)}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array [{ tipo_servicio: "...", cantidad: ... }]
          return data || [];
        } catch (error) {
          console.log("Error fetching services by client type", error);
          return [];
        }
      },

      getServiceById: async (serviceId) => {
        try {
          const response = await fetch(
            `${API_URL}/servicios/${serviceId}`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects service object
          return data;
        } catch (error) {
          console.log("Error during getting service data by ID:", error);
          throw error;
        }
      },

      getTopServices: async () => {
        try {
          const response = await fetch(
            `${API_URL}/top-services`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array [{ tipo_servicio: "...", count: ... }]
          setStore({ topServices: data || [] });
          return data || [];
        } catch (error) {
          console.log("Error during getting top services", error);
          setStore({ topServices: [] });
          return [];
        }
      },

      getTotalServices: async () => {
        try {
          const response = await fetch(
            `${API_URL}/servicios/total`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects { total: number }
          setStore({ totalServices: data?.total || 0 });
          return data?.total || 0;
        } catch (error) {
          console.log("Error fetching total services", error);
          setStore({ totalServices: 0 });
          return 0;
        }
      },

      getServiceCountsByType: async () => { // Counts grouped by ClientType and ServiceType
        try {
          const response = await fetch(
            `${API_URL}/service-counts-by-type`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects nested object { ClientType: { ServiceType: count } }
          setStore({ serviceCountsByType: data || {} });
          return data || {};
        } catch (error) {
          console.log("Error during getting service counts by type", error);
          setStore({ serviceCountsByType: {} });
          return {};
        }
      },

      getServiceCountsByClientType: async (clientType) => { // Total count for a specific ClientType
        try {
          const response = await fetch(
            `${API_URL}/service-counts-by-client-type/${encodeURIComponent(clientType)}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects { total_count: number }
          const currentCounts = getStore().serviceCountsByClientType || {};
          currentCounts[clientType] = data?.total_count || 0;
          setStore({ serviceCountsByClientType: currentCounts });
          return data?.total_count || 0;
        } catch (error) {
          console.log("Error fetching service counts for client type", clientType, error);
          // Optionally update store to reflect error for this client type
          return 0;
        }
      },

      // This seems redundant with getServiceCountsByType, maybe remove?
      // getClientServiceCounts: async () => { ... }

      getServiceCountsByPlatform: async () => {
        try {
            // Usa API_URL que ya incluye /api
            const response = await fetch(
                `${API_URL}/service-counts-by-platform`, // Correcto: usa API_URL
                {
                    method: "GET",
                    headers: getAuthHeaders(), // Correcto: usa el helper para autenticación
                }
            );
            // Usa el helper para manejar la respuesta (incluye 401, errores, parsing JSON)
            const data = await handleApiResponse(response); // Correcto: usa el helper

            // Guarda los datos en el store (data será null si la respuesta es 204 o vacía)
            setStore({ serviceCountsByPlatform: data || [] }); // Correcto: guarda en la clave correcta del store
            console.log("Datos de conteo por plataforma obtenidos:", data);
            return data || []; // Devuelve los datos o un array vacío

        } catch (error) {
            // El manejo de errores (incluyendo 401 -> logout) ya ocurre en handleApiResponse
            // Aquí solo logueamos el error final y reseteamos el store
            console.error("Error al obtener conteo por plataforma (acción final):", error);
            setStore({ serviceCountsByPlatform: [] }); // Limpiar en caso de error
            // No es necesario retornar un objeto de error aquí, handleApiResponse ya lanzó el error.
            // Si un componente necesita saber del error, debe usar try/catch al llamar a esta acción.
            // throw error; // Puedes re-lanzar si los componentes necesitan manejarlo explícitamente
            return []; // O simplemente retornar vacío en caso de error para los gráficos
        }
    },
      getNewServicesCurrentMonth: async () => {
        try {
          const response = await fetch(
            `${API_URL}/new-services-current-month`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array of service objects with client info
          setStore({ newServicesCurrentMonth: data || [] });
          return data || [];
        } catch (error) {
          console.log("Error getting new services for current month", error);
          setStore({ newServicesCurrentMonth: [] });
          return [];
        }
      },

      getNewServicesPastMonth: async () => {
        try {
          const response = await fetch(
            `${API_URL}/new-services-last-month`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array of service objects
          setStore({ newServicesLastMonth: data || [] });
          return data || [];
        } catch (error) {
          console.log("Error getting new services for last month", error);
          setStore({ newServicesLastMonth: [] });
          return [];
        }
      },

      updateServiceData: async (serviceId, serviceData) => {
         if (!serviceId || typeof serviceId !== "number" || !serviceData || typeof serviceData !== "object" || Object.keys(serviceData).length === 0) {
            console.error("Invalid input for updateServiceData");
            throw new Error("Invalid input for updating service data.");
        }
        try {
          const response = await fetch(
            `${API_URL}/servicios/${serviceId}`,
            {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify(serviceData),
            }
          );
          const data = await handleApiResponse(response); // Expects { message: "...", service: {...} }
          // Optionally update service in local state if needed
          return data;
        } catch (error) {
          console.error("Error during updating service data:", error.message);
          return { error: true, message: error.message }; // Return error object
        }
      },

      deleteService: async (serviceId) => {
         if (!serviceId || typeof serviceId !== "number") {
            console.error("Invalid input for deleteService");
            throw new Error("Invalid service ID.");
        }
        try {
          const response = await fetch(
            `${API_URL}/services/${serviceId}`, // Backend uses /services/:id for DELETE
            {
              method: "DELETE",
              headers: getAuthHeaders(),
            }
          );
           // Handle potential 204 No Content
          if (response.status === 204) {
              console.log("Service deleted successfully (204)");
              // Optionally update store (e.g., remove service from a list)
              return { success: true, message: "Servicio eliminado con éxito" };
          }
          const data = await handleApiResponse(response); // Expects { message: "..." } on 200 OK
          // Optionally update store
          return { success: true, message: data?.message || "Deleted successfully" };
        } catch (error) {
          console.error("Error during deleting service:", error.message);
          return { success: false, message: error.message };
        }
      },

      getServiciosRetiradosPorMes: async (month, year) => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-retirados-por-mes?month=${month}&year=${year}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array
          return data || [];
        } catch (error) {
          console.error("Error fetching servicios retirados:", error);
          return [];
        }
      },

      getNewServicesMonthlyTrend: async () => {
        try {
            const response = await fetch(`${API_URL}/new-services-monthly`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            const data = await handleApiResponse(response); // Expects array [{ month: "YYYY-MM", count: ... }]
            const sortedData = (data || []).sort((a, b) => a.month.localeCompare(b.month));
            setStore({ newServicesMonthlyTrend: sortedData });
            console.log("Tendencia mensual de nuevos servicios obtenida:", sortedData);
            return sortedData;
        } catch (error) {
            console.error("Error al obtener tendencia mensual:", error);
            setStore({ newServicesMonthlyTrend: [] });
            return { error: true, message: error.message }; // Return error object
        }
    },

      getServiciosAprovisionadosPorMes: async (month, year) => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-aprovisionados-por-mes?month=${month}&year=${year}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array
          return data || [];
        } catch (error) {
          console.error("Error fetching servicios aprovisionados por mes:", error);
          return [];
        }
      },

      getServiciosAprovisionadosPorMesAnual: async (year) => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-aprovisionados-por-mes-anual?year=${year}`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array [{ mes: ..., servicios: [...] }]
          return data || [];
        } catch (error) {
          console.error("Error fetching servicios aprovisionados por mes anual:", error);
          return [];
        }
      },

      getServiciosAprovisionadosPorAno: async () => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-aprovisionados-por-ano`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects array [{ ano: ..., servicios: [...] }]
          return data || [];
        } catch (error) {
          console.error("Error fetching servicios aprovisionados por año:", error);
          return [];
        }
      },

      getServiciosActivos: async () => {
        try {
          const response = await fetch(
            `${API_URL}/servicios-activos`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects array of service objects
          return data || [];
        } catch (error) {
          console.error("Error during getting active services", error);
          throw error;
        }
      },

      getCompleteClientServices: async () => { // For export
        try {
          const response = await fetch(
            `${API_URL}/exportar-datos-completos`,
             {
                method: "GET",
                headers: getAuthHeaders()
            }
          );
          const data = await handleApiResponse(response); // Expects { clientes: [...], servicios: [...] }
          return data || { clientes: [], servicios: [] };
        } catch (error) {
          console.error("Error fetching complete data:", error);
          return { clientes: [], servicios: [] };
        }
      },

      // ==============================
      // Acciones Generales (Documentos, Excel)
      // ==============================
      uploadDocument: async (entityType, entityId, formData) => {
        try {
          const token = sessionStorage.getItem("jwt_token");
          const headers = {}; // Don't set Content-Type for FormData
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(
            `${API_URL}/upload-document/${entityType}/${entityId}`,
            {
              method: "POST",
              headers: headers, // Use custom headers without Content-Type
              body: formData,
            }
          );
          // Need to handle response carefully, might not be JSON on error
           if (response.status === 401) {
                console.error("Unauthorized access (401). Logging out.");
                getActions().LogOut();
                throw new Error("Unauthorized");
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`API Error ${response.status}:`, errorData.error || response.statusText);
                throw new Error(errorData.error || `HTTP error ${response.status}`);
            }
           const data = await response.json(); // Assume success returns JSON
           return data; // Expects { message: "...", document_id: ... }
        } catch (error) {
          console.error("Error uploading document:", error);
          throw error;
        }
      },

      checkDocumentExists: async (entityType, entityId) => {
        try {
          const response = await fetch(
            `${API_URL}/${entityType}/${entityId}/document-exists`,
            {
              method: "GET",
              headers: getAuthHeaders(),
            }
          );
          const data = await handleApiResponse(response); // Expects { exists: boolean, document_name: "...", document_id: ... }
          setStore({
            documentName: data?.document_name || null, // Use null if undefined
            documentId: data?.document_id || null,
          });
          return data?.exists || false;
        } catch (error) {
          console.error("Error checking document existence:", error);
          setStore({ documentName: null, documentId: null }); // Reset on error
          throw error;
        }
      },

      downloadDocument: async (documentId) => {
        // Downloading files doesn't typically use handleApiResponse as it expects Blob, not JSON
        try {
          const token = sessionStorage.getItem("jwt_token");
          const headers = {};
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(
            // Assuming backend route exists for download by ID, adjust if needed
            `${API_URL}/download-document/${documentId}`, // You might need to create this endpoint
            {
              method: "GET",
              headers: headers,
            }
          );

          if (response.status === 401) {
             console.error("Unauthorized access (401). Logging out.");
             getActions().LogOut();
             throw new Error("Unauthorized");
          }
          if (!response.ok) {
            // Try to get error message if backend sends JSON error for downloads
            const errorData = await response.json().catch(() => ({}));
            console.error(`API Error ${response.status}:`, errorData.error || response.statusText);
            throw new Error(errorData.error || `Failed to download document (${response.status})`);
          }

          const contentDisposition = response.headers.get("content-disposition");
          let fileName = "documento_descargado";
          if (contentDisposition?.includes("filename=")) {
            fileName = contentDisposition.split("filename=")[1].split(";")[0].replace(/['"]/g, "");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

        } catch (error) {
          console.error("Error downloading document:", error);
          throw error;
        }
      },

      deleteDocument: async (documentId) => {
        try {
          const response = await fetch(
            `${API_URL}/delete-document/${documentId}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(),
            }
          );
           // Handle potential 204 No Content
          if (response.status === 204) {
              console.log("Document deleted successfully (204)");
              setStore({ documentName: null, documentId: null }); // Clear store state
              return { message: "Document deleted successfully" };
          }
          const data = await handleApiResponse(response); // Expects { message: "..." } on 200 OK
          setStore({ documentName: null, documentId: null }); // Clear store state
          return data;
        } catch (error) {
          console.error("Error deleting document:", error);
          throw error;
        }
      },

      uploadExcelData: async (excelData, estadoServicio) => {
        try {
          const transformedData = excelData.map(item => ({
            ...item,
            rif: String(item.rif),
          }));

          const response = await fetch(
            `${API_URL}/upload-excel`,
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({ data: transformedData, estado_servicio: estadoServicio }),
            }
          );
          const result = await handleApiResponse(response); // Expects { message: "...", skipped_duplicates: ..., skipped_missing_rif: ... }
          console.log("Excel Data uploaded successfully:", result);
          return result;
        } catch (error) {
          console.error("Error uploading excel data:", error);
          throw error;
        }
      },

    }, // End actions
  }; // End return
}; // End getState

export default getState;
