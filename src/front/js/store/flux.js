const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state from session storage on load
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage
  const storedToken = sessionStorage.getItem("token"); // Retrieve JWT token from session storage

  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize with session storage value
      user: storedUser || null, // Initialize user state with stored user data
      token: storedToken || null, // Initialize token state with stored token
      users: [], // Add users state
      currentClient: [], // Add currentClient state
      clientData: [], // Add clientData state
      totalServices: 0, // Add totalServices state
      totalClients: 0, // Add totalClients state
      clientCountsByType: {},
      serviceCountsByType: {}, // Add servicesCountsByType state
      serviceCountsByClientType: {}, // Add servicesCountsByClientType state
      topServices: [],
      newServicesCurrentMonth: [],
      newServicesLastMonth: [],
      aprovisionados: [],
      activeServiceCount: 0,
      documentName: [], // Add document state
      documentId: null, // Add document ID state
      serviceCountsByPlatform: [],
      newServicesMonthlyTrend: [],
      newServicesQuarterlyTrend: [],
      newServicesYearlyTrend: [],
      serviceGrowthProjection: {},
    },
    actions: {
      // Autenticación
      login: async (username, password) => {
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
            const { access_token, user } = data;

            // Guardar el token y el usuario en el estado y en sessionStorage
            setStore({ user, token: access_token, isAuthenticated: true });
            sessionStorage.setItem("isAuthenticated", "true");
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("token", access_token);

            console.log("Autenticado", user);
            return data;
          } else {
            setStore({ isAuthenticated: false });
            console.error("Login failed");
          }
        } catch (error) {
          console.log("Error during login", error);
        }
      },
      LogOut: () => {
        setStore({ user: null, token: null, isAuthenticated: false });
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        console.log("User logged out");
      },
      // Función auxiliar para obtener el token JWT desde el estado
      getToken: () => {
        const store = getStore();
        return store.token;
      },
      // Wrapper para realizar solicitudes HTTP con el token JWT
      fetchWithToken: async (url, options = {}) => {
        const token = getActions().getToken();
        if (!token) {
          throw new Error("No JWT token available. Please log in.");
        }

        // Añadir el token JWT al header Authorization
        const headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };

        return fetch(url, { ...options, headers });
      },
      // Gestión de Usuarios
      addUser: async (user) => {
        try {
          const response = await getActions().fetchWithToken(
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
            const store = getStore();
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
        try {
          const response = await getActions().fetchWithToken(
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
            const store = getStore();
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
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/users`
          );

          if (response.ok) {
            const data = await response.json();
            const store = getStore();
            const loggedInUser = store.user;
            const filteredUsers = data.filter(
              (user) => user.id !== loggedInUser.id
            );
            setStore({ users: filteredUsers });
            return filteredUsers;
          } else {
            console.error("Failed to fetch users data");
          }
        } catch (error) {
          console.log("Error during fetching users data", error);
        }
      },
      deleteUser: async (userId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const store = getStore();
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
      // Agregar y Consultar Clientes
      addClientData: async (data) => {
        try {
          const response = await getActions().fetchWithToken(
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
      fetchClientData: async (name) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/client-consult/?name=${name}`,
            {
              method: "GET",
            }
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
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/client-suggestions/?query=${query}`,
            {
              method: "GET",
            }
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
          const response = await getActions().fetchWithToken(
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
      getTotalClients: async () => {
        try {
          const response = await getActions().fetchWithToken(
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
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/clientes/${clientId}`,
            {
              method: "GET",
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
      getClientbyTipo: async (tipo) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/clients_tipo?tipo=${tipo}`,
            {
              method: "GET",
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
      // Actualizar y Eliminar Clientes
      updateClientData: async (clientId, clientData) => {
        try {
          if (!clientId || typeof clientId !== "number") {
            throw new Error("Invalid client ID. It must be a number.");
          }
          if (
            !clientData ||
            typeof clientData !== "object" ||
            Object.keys(clientData).length === 0
          ) {
            throw new Error(
              "Invalid client data. It must be a non-empty object."
            );
          }
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/clients/${clientId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(clientData),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update client: ${errorData.message}`);
          }
          const data = await response.json();
          setStore({ client: data });
          return { success: true, data };
        } catch (error) {
          console.error("Error during updating client data:", error.message);
          return { success: false, message: error.message };
        }
      },
      deleteClientAndServices: async (clientId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/clients/${clientId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Failed to delete user and services: ${errorData.message}`
            );
          }
          return { success: true };
        } catch (error) {
          console.error(
            "Error during deleting user and services:",
            error.message
          );
          return { success: false, message: error.message };
        }
      },
      // Acciones Combinadas
      addClientAndServiceData: async (clientData, serviceData) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/add_client_and_service`,
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
      // Agregar y Consultar Servicios
      addServiceData: async (data) => {
        try {
          const response = await getActions().fetchWithToken(
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
      getServicebyClient: async (clientId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-by-cliente/${clientId}`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const data = await response.json();
            const activeServices = data.services.filter(
              (service) => service.estado_servicio !== "Retirado"
            );
            setStore({ activeServiceCount: activeServices.length });
            return data.services;
          } else {
            console.error("Failed to get service data");
            throw new Error("Failed to fetch services");
          }
        } catch (error) {
          console.error("Error during getting service data", error);
          throw error;
        }
      },
      // Obtener servicios por tipo de cliente
      getServicesByClientType: async (clientType) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/services_by_client_type/${clientType}`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to fetch services by client type");
          }
        } catch (error) {
          console.log("Error fetching services by client type", error);
        }
      },
      // Obtener servicio por ID
      getServiceById: async (serviceId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/${serviceId}`,
            {
              method: "GET",
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
      // Obtener los servicios más populares
      getTopServices: async () => {
        try {
          const response = await getActions().fetchWithToken(
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
      // Obtener el total de servicios
      getTotalServices: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/total`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ totalServices: data.total });
          } else {
            console.error("Failed to fetch total services");
          }
        } catch (error) {
          console.log("Error fetching total services", error);
        }
      },
      // Obtener conteo de servicios por tipo
      getServiceCountsByType: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-type`
          );
          if (response.ok) {
            const data = await response.json();
            if (Object.keys(data).length === 0) {
              console.warn("No service counts data available");
              setStore({ serviceCountsByType: {} });
            } else {
              setStore({ serviceCountsByType: data });
            }
          } else {
            console.error("Failed to get service counts by type");
          }
        } catch (error) {
          console.log("Error during getting service counts by type", error);
        }
      },
      // Obtener conteo de servicios por tipo de cliente
      getServiceCountsByClientType: async (clientType) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-client-type/${clientType}`
          );
          if (response.ok) {
            const data = await response.json();
            const currentCounts = getStore().serviceCountsByClientType || {};
            currentCounts[clientType] = data.total_count || 0;
            setStore({ serviceCountsByClientType: currentCounts });
            return data.total_count || 0;
          } else {
            console.error("Failed to fetch service counts by client type");
          }
        } catch (error) {
          console.log("Error fetching service counts by client type", error);
        }
      },
      // Obtener conteo de servicios por plataforma
      getServiceCountsByPlatform: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-platform`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ serviceCountsByPlatform: data });
          } else {
            console.error("Failed to get service counts by platform");
          }
        } catch (error) {
          console.log("Error during getting service counts by platform", error);
        }
      },
      // Obtener servicios aprovisionados
      getAprovisionados: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/aprovisionados`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ aprovisionados: data });
            return data;
          } else {
            console.error("Failed to get aprovisionados");
            return [];
          }
        } catch (error) {
          console.log("Error during getting aprovisionados", error);
          return [];
        }
      },
      // Obtener nuevos servicios del mes actual
      getNewServicesCurrentMonth: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-current-month`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesCurrentMonth: data });
          } else {
            console.error("Failed to get new services for the current month");
          }
        } catch (error) {
          console.log(
            "Error during getting new services for the current month",
            error
          );
        }
      },
      // Obtener nuevos servicios del mes pasado
      getNewServicesPastMonth: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-last-month`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesLastMonth: data });
          } else {
            console.error("Failed to get new services for the last month");
          }
        } catch (error) {
          console.log(
            "Error during getting new services for the last month",
            error
          );
        }
      },
      // Actualizar datos de un servicio
      updateServiceData: async (serviceId, serviceData) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios/${serviceId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(serviceData),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update service data");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error during updating service data:", error.message);
          return { error: true, message: error.message };
        }
      },
      // Eliminar un servicio
      deleteService: async (serviceId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/services/${serviceId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete service");
          }
          return { success: true };
        } catch (error) {
          console.error("Error during deleting service:", error.message);
          return { success: false, message: error.message };
        }
      },
      // Obtener servicios retirados por mes
      getServiciosRetiradosPorMes: async (month, year) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-retirados-por-mes?month=${month}&year=${year}`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get servicios retirados por mes");
          }
        } catch (error) {
          console.log("Error fetching servicios retirados por mes", error);
        }
      },
      // Obtener tendencia mensual de nuevos servicios
      getNewServicesMonthlyTrend: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-monthly`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesMonthlyTrend: data });
          } else {
            console.error("Failed to get new services monthly trend");
          }
        } catch (error) {
          console.log("Error during getting new services monthly trend", error);
        }
      },
      // Obtener tendencia trimestral de nuevos servicios
      getNewServicesQuarterlyTrend: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-quarterly`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesQuarterlyTrend: data });
          } else {
            console.error("Failed to get new services quarterly trend");
          }
        } catch (error) {
          console.log("Error during getting new services quarterly trend", error);
        }
      },
      // Obtener tendencia anual de nuevos servicios
      getNewServicesYearlyTrend: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-yearly`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesYearlyTrend: data });
          } else {
            console.error("Failed to get new services yearly trend");
          }
        } catch (error) {
          console.log("Error during getting new services yearly trend", error);
        }
      },
      // Obtener proyección de crecimiento de servicios para los próximos 6 meses
      getServiceGrowthProjection: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/service-growth-projection`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ serviceGrowthProjection: data });
          } else {
            console.error("Failed to get service growth projection");
          }
        } catch (error) {
          console.log("Error during getting service growth projection", error);
        }
      },
      // Obtener servicios aprovisionados por mes
      getServiciosAprovisionadosPorMes: async (month, year) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-mes?month=${month}&year=${year}`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get servicios aprovisionados por mes");
          }
        } catch (error) {
          console.log("Error fetching servicios aprovisionados por mes", error);
        }
      },
      // Obtener servicios aprovisionados por mes anual
      getServiciosAprovisionadosPorMesAnual: async (year) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-mes-anual?year=${year}`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error(
              "Failed to get servicios aprovisionados por mes anual"
            );
          }
        } catch (error) {
          console.log(
            "Error fetching servicios aprovisionados por mes anual",
            error
          );
        }
      },
      // Obtener servicios aprovisionados por año
      getServiciosAprovisionadosPorAno: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-ano`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get servicios aprovisionados por año");
          }
        } catch (error) {
          console.log("Error fetching servicios aprovisionados por año", error);
        }
      },
      // Obtener servicios activos
      getServiciosActivos: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-activos`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to get active services");
          }
        } catch (error) {
          console.log("Error during getting active services", error);
        }
      },
      // Exportar datos completos
      getCompleteClientServices: async () => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/exportar-datos-completos`
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error("Failed to export complete client services");
          }
        } catch (error) {
          console.log("Error during exporting complete client services", error);
        }
      },
      // Acciones generales
      // Subir documento
      uploadDocument: async (entityType, entityId, formData) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/upload-document/${entityType}/${entityId}`,
            {
              method: "POST",
              body: formData,
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload document");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error uploading document:", error);
          throw error;
        }
      },
      // Verificar si existe un documento
      checkDocumentExists: async (entityType, entityId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/${entityType}/${entityId}/document-exists`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({
              documentName: data.document_name,
              documentId: data.document_id,
            });
            return data.exists;
          } else {
            console.error("Failed to check document existence");
          }
        } catch (error) {
          console.log("Error during checking document existence", error);
        }
      },
      // Descargar documento
      downloadDocument: async (documentId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/download-document/${documentId}`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to download document");
          }
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          let fileName = "documento_descargado";
          if (contentDisposition && contentDisposition.includes("filename=")) {
            fileName = contentDisposition
              .split("filename=")[1]
              .split(";")[0]
              .replace(/['"]/g, "");
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
      // Eliminar documento
      deleteDocument: async (documentId) => {
        try {
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/delete-document/${documentId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete document");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error during deleting document", error);
        }
      },
      // Subir datos de Excel
      uploadExcelData: async (data, estadoServicio) => {
        try {
          const transformedData = data.map((item) => ({
            ...item,
            rif: String(item.rif),
          }));
          const response = await getActions().fetchWithToken(
            `${process.env.REACT_APP_BACKEND_URL}/upload-excel`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: transformedData,
                estado_servicio: estadoServicio,
              }),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error details:", errorData);
            throw new Error(
              "Network response was not ok: " + (errorData.error || "")
            );
          }
          const result = await response.json();
          console.log("Data uploaded successfully:", result);
          return result;
        } catch (error) {
          console.error("Error uploading data:", error);
          throw error;
        }
      },
    },
  };
};
export default getState;
