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
      serviceCountsByType: {}, // Add servicesCountsByType state
      serviceCountsByClientType: {}, // Add servicesCountsByClientType state
      topServices: [],
      newServicesCurrentMonth: [],
      newServicesLastMonth: [],
      aprovisionados: [],
      activeServiceCount: 0,
      documentName: [], // Add document state
      documentId: null, // Add document ID state
    },

    actions: {
      // Autenticación
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
      // Gestión de Usuarios
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
      // Agregar y Consultar Clientes
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
      // Actualizar y Eliminar Clientes
      updateClientData: async (clientId, clientData) => {
        try {
          // Validar que clientId sea un número válido
          if (!clientId || typeof clientId !== "number") {
            throw new Error("Invalid client ID. It must be a number.");
          }

          // Validar que clientData sea un objeto no vacío
          if (
            !clientData ||
            typeof clientData !== "object" ||
            Object.keys(clientData).length === 0
          ) {
            throw new Error(
              "Invalid client data. It must be a non-empty object."
            );
          }

          // Realizar la solicitud PUT
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clients/${clientId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(clientData),
            }
          );

          // Manejar respuestas no exitosas
          if (!response.ok) {
            const errorData = await response.json(); // Intentar obtener detalles del error del backend
            throw new Error(
              `Failed to update client: ${
                errorData.message || response.statusText
              }`
            );
          }

          // Procesar la respuesta exitosa
          const data = await response.json();

          // Actualizar el estado global con los datos actualizados
          setStore({ client: data });

          // Devolver los datos actualizados para su uso en el componente que llama a esta función
          return { success: true, data };
        } catch (error) {
          // Registrar el error en la consola y devolver un objeto con detalles
          console.error("Error during updating client data:", error.message);
          return { success: false, message: error.message };
        }
      },
      deleteClientAndServices: async (clientId) => {
        const store = getStore;
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clients/${clientId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Manejar respuestas no exitosas
          if (!response.ok) {
            const errorData = await response.json(); // Intentar obtener detalles del error del backend
            throw new Error(
              `Failed to delete user and services: ${
                errorData.message || response.statusText
              }`
            );
          }
         
          // Si la respuesta es exitosa, devolver un objeto indicando el éxito
          return { success: true };
        } catch (error) {
          // Registrar el error en la consola y devolver un objeto con detalles
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
          const response = await fetch(
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
      getServicebyClient: async (clientId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-by-cliente/${clientId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const activeServices = data.services.filter(
              (service) => service.estado_servicio !== "Retirado"
            );
            setStore({ activeServiceCount: activeServices.length });

            return data.services; // Retorna los servicios directamente
          } else {
            console.error("Failed to get service data");
            throw new Error("Failed to fetch services");
          }
        } catch (error) {
          console.error("Error during getting service data", error);
          throw error; // Propaga el error para manejarlo en el componente
        }
      },
      getServicesByClientType: async (clientType) => {
        try {
          const response = await fetch(
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
      getServiceCountsByType: async () => {
        try {
          const response = await fetch(
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
      getServiceCountsByClientType: async (clientType) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-client-type/${clientType}`
          );
          if (response.ok) {
            const data = await response.json();
            const currentCounts = getStore().serviceCountsByClientType || {}; // Obtener el estado actual
            currentCounts[clientType] = data.total_count || 0; // Actualizar el conteo para el tipo de cliente
            setStore({ serviceCountsByClientType: currentCounts }); // Guardar el estado actualizado
            return data.total_count || 0;
          } else {
            console.error("Failed to fetch service counts by client type");
          }
        } catch (error) {
          console.log("Error fetching service counts by client type", error);
        }
      },
      getClientServiceCounts: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/service-counts-by-type`
          );
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

      getAprovisionados: async () => {
        try {
          const response = await fetch(
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

      getNewServicesCurrentMonth: async () => {
        try {
          const response = await fetch(
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
      getNewServicesPastMonth: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/new-services-last-month`
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ newServicesLastMonth: data });
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

      // Actualizar y Eliminar Servicios
      updateServiceData: async (serviceId, serviceData) => {
        try {
          // Validar que serviceId sea un número válido
          if (!serviceId || typeof serviceId !== "number") {
            throw new Error("Invalid service ID. It must be a number.");
          }

          // Validar que serviceData sea un objeto no vacío
          if (
            !serviceData ||
            typeof serviceData !== "object" ||
            Object.keys(serviceData).length === 0
          ) {
            throw new Error(
              "Invalid service data. It must be a non-empty object."
            );
          }

          // Realizar la solicitud PUT
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

          // Manejar respuestas no exitosas
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update service data");
          }

          // Procesar la respuesta exitosa
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error during updating service data:", error.message);
          return { error: true, message: error.message };
        }
      },
      deleteService: async (serviceId) => {
        try {
          // Validar que serviceId sea un número válido
          if (!serviceId || typeof serviceId !== "number") {
            throw new Error("Invalid service ID. It must be a number.");
          }

          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/services/${serviceId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Manejar respuestas no exitosas
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete service");
          }

          // Si la respuesta es exitosa, devolver un objeto indicando el éxito
          return { success: true };
        } catch (error) {
          console.error("Error during deleting service:", error.message);
          return { success: false, message: error.message };
        }
      },
      getServiciosRetiradosPorMes: async (month, year) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-retirados-por-mes?month=${month}&year=${year}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener servicios retirados");
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching servicios retirados:", error);
          return [];
        }
      },

      getServiciosAprovisionadosPorMes: async (month, year) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-mes?month=${month}&year=${year}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener servicios aprovisionados");
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching servicios aprovisionados:", error);
          return [];
        }
      },
      getServiciosAprovisionadosPorMesAnual: async (year) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-mes-anual?year=${year}`
          );
          if (!response.ok) {
            throw new Error(
              "Error al obtener servicios aprovisionados por mes"
            );
          }
          return await response.json();
        } catch (error) {
          console.error(
            "Error fetching servicios aprovisionados por mes:",
            error
          );
          return [];
        }
      },
      getServiciosAprovisionadosPorAno: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-aprovisionados-por-ano`
          );
          if (!response.ok) {
            throw new Error(
              "Error al obtener servicios aprovisionados por año"
            );
          }
          return await response.json();
        } catch (error) {
          console.error(
            "Error fetching servicios aprovisionados por año:",
            error
          );
          return [];
        }
      },
      getServiciosActivos: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/servicios-activos`,
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
            console.error("Failed to get active services");
            throw new Error("Failed to fetch active services");
          }
        } catch (error) {
          console.error("Error during getting active services", error);
          throw error;
        }
      },

      getCompleteClientServices: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/exportar-datos-completos`
          );
          if (!response.ok) {
            throw new Error("Error al obtener el datos completos");
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching datos completos:", error);
          return [];
        }
      },
      //Acciones generales
      // Document handling actions
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

      checkDocumentExists: async (entityType, entityId) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/${entityType}/${entityId}/document-exists`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to check document existence"
            );
          }

          const data = await response.json();
          setStore({
            documentName: data.document_name,
            documentId: data.document_id, // Almacenar el ID del documento
          });
          return data.exists; // Retornar si el documento existe
        } catch (error) {
          console.error("Error checking document existence:", error);
          throw error;
        }
      },

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

          // Obtener el nombre del archivo del encabezado Content-Disposition
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          let fileName = "documento_descargado"; // Valor predeterminado
          if (contentDisposition && contentDisposition.includes("filename=")) {
            fileName = contentDisposition
              .split("filename=")[1]
              .split(";")[0]
              .replace(/['"]/g, ""); // Eliminar comillas
          }

          // Convertir la respuesta a un blob
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          // Crear un enlace temporal para descargar el archivo
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName; // Usar el nombre del archivo obtenido
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
          console.error("Error deleting document:", error);
          throw error;
        }
      },

      uploadExcelData: async (data, estadoServicio) => {
        try {
          // Ensure 'rif' is a string
          const transformedData = data.map(item => ({
            ...item,
            rif: String(item.rif), // Convert rif to string
          }));

          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/upload-excel`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ data: transformedData, estado_servicio: estadoServicio }),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error details:", errorData);
            throw new Error("Network response was not ok: " + (errorData.error || ""));
          }
          const result = await response.json();
          console.log("Data uploaded successfully:", result);
          return result;
        } catch (error) {
          console.error("Error uploading data:", error);
          throw error; // Re-throw for handling in the component
        }
      },

    },
  };
};

export default getState;
