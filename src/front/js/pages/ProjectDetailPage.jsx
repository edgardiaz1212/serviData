import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import ProjectProgressChart from "../component/project/ProjectProgressChart.jsx";
import PhaseProgressBar from "../component/project/PhaseProgressBar.jsx";
import {
  ArrowLeft,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions, store } = useContext(Context);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [fulfillmentValue, setFulfillmentValue] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [attentionPoints, setAttentionPoints] = useState([]);
  const [showAttentionModal, setShowAttentionModal] = useState(false);
  const [editingAttentionPoint, setEditingAttentionPoint] = useState(null);
  const [attentionForm, setAttentionForm] = useState({
    impacto: "",
    acciones_ejecutar: "",
    fecha_ocurrencia: "",
    fecha_solucion: "",
    responsable: "",
  });
  const isOwner = project && store.user && project.user_id === store.user.id;

  useEffect(() => {
    if (id && id !== "new") {
      fetchProject();
    } else if (id === "new") {
      // Redirect to EditProjectPage for new projects
      navigate("/new-project", { replace: true });
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "attention" && id && id !== "new") {
      fetchAttentionPoints();
    }
  }, [activeTab, id]);

  const fetchProject = async () => {
    try {
      const data = await actions.fetchProjectById(id);
      if (data) {
        setProject(data);
      } else {
        toast.error("Error al obtener el proyecto");
      }
    } catch (error) {
      toast.error("Error al obtener el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttentionPoints = async () => {
    try {
      const data = await actions.fetchAttentionPoints(id);
      setAttentionPoints(data || []);
    } catch (error) {
      toast.error("Error al obtener puntos de atención");
      console.error("Error fetching attention points:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/projects");
  };

  const handleUpdateCompliance = async (
    activityId,
    complianceValue,
    completionDate = null
  ) => {
    try {
      const result = await actions.updateProjectActivityCompliance(
        id,
        activityId,
        complianceValue,
        completionDate
      );

      if (result && !result.error) {
        toast.success("Cumplimiento actualizado correctamente");
        // Update local state instead of refetching to maintain position
        setProject((prevProject) => {
          if (!prevProject) return prevProject;

          return {
            ...prevProject,
            phases: prevProject.phases.map((phase) => ({
              ...phase,
              activities:
                phase.activities?.map((activity) =>
                  activity.id === activityId
                    ? {
                        ...activity,
                        real_percent: complianceValue,
                        completion_date: completionDate,
                      }
                    : activity
                ) || [],
            })),
          };
        });
      } else {
        const errorMessage = result?.message || "Error desconocido";
        toast.error(`Error al actualizar cumplimiento: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("Error de conexión al actualizar cumplimiento");
      console.error("Error updating compliance:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "En progreso":
        return <Clock className="text-blue-500" size={20} />;
      case "Completado":
        return <CheckCircle className="text-green-500" size={20} />;
      case "Retrasado":
        return <AlertTriangle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getDeviationColor = (deviation) => {
    if (deviation < -10) return "text-red-600 bg-red-50";
    if (deviation > 10) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const handleCreateAttentionPoint = async (formData) => {
    try {
      const result = await actions.createAttentionPoint(id, formData);
      if (result && !result.error) {
        toast.success("Punto de atención creado correctamente");
        fetchAttentionPoints();
      } else {
        toast.error("Error al crear punto de atención");
      }
    } catch (error) {
      toast.error("Error de conexión al crear punto de atención");
      console.error("Error creating attention point:", error);
    }
  };

  const handleEditAttentionPoint = async (pointId, formData) => {
    try {
      const result = await actions.updateAttentionPoint(id, pointId, formData);
      if (result && !result.error) {
        toast.success("Punto de atención actualizado correctamente");
        fetchAttentionPoints();
      } else {
        toast.error("Error al actualizar punto de atención");
      }
    } catch (error) {
      toast.error("Error de conexión al actualizar punto de atención");
      console.error("Error updating attention point:", error);
    }
  };

  const handleDeleteAttentionPoint = async (pointId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este punto de atención?")) {
      try {
        const result = await actions.deleteAttentionPoint(id, pointId);
        if (result && !result.error) {
          toast.success("Punto de atención eliminado correctamente");
          fetchAttentionPoints();
        } else {
          toast.error("Error al eliminar punto de atención");
        }
      } catch (error) {
        toast.error("Error de conexión al eliminar punto de atención");
        console.error("Error deleting attention point:", error);
      }
    }
  };

  const handleOpenAttentionModal = (point = null) => {
    if (point) {
      setEditingAttentionPoint(point);
      setAttentionForm({
        impacto: point.impacto || "",
        acciones_ejecutar: point.acciones_ejecutar || "",
        fecha_ocurrencia: point.fecha_ocurrencia ? new Date(point.fecha_ocurrencia).toISOString().split("T")[0] : "",
        fecha_solucion: point.fecha_solucion ? new Date(point.fecha_solucion).toISOString().split("T")[0] : "",
        responsable: point.responsable || "",
      });
    } else {
      setEditingAttentionPoint(null);
      setAttentionForm({
        impacto: "",
        acciones_ejecutar: "",
        fecha_ocurrencia: "",
        fecha_solucion: "",
        responsable: "",
      });
    }
    setShowAttentionModal(true);
  };

  const handleCloseAttentionModal = () => {
    setShowAttentionModal(false);
    setEditingAttentionPoint(null);
    setAttentionForm({
      impacto: "",
      acciones_ejecutar: "",
      fecha_ocurrencia: "",
      fecha_solucion: "",
      responsable: "",
    });
  };

  const handleSaveAttentionPoint = async () => {
    if (!attentionForm.impacto.trim() || !attentionForm.acciones_ejecutar.trim()) {
      toast.error("Los campos Impacto y Acciones a Ejecutar son obligatorios");
      return;
    }

    const formData = {
      impacto: attentionForm.impacto,
      acciones_ejecutar: attentionForm.acciones_ejecutar,
      fecha_ocurrencia: attentionForm.fecha_ocurrencia || null,
      fecha_solucion: attentionForm.fecha_solucion || null,
      responsable: attentionForm.responsable,
    };

    if (editingAttentionPoint) {
      await handleEditAttentionPoint(editingAttentionPoint.id, formData);
    } else {
      await handleCreateAttentionPoint(formData);
    }

    handleCloseAttentionModal();
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-5">
        <h3 className="h4 fw-medium text-dark mb-3">Proyecto no encontrado</h3>
        <button onClick={handleBack} className="btn btn-primary">
          Volver a Proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={handleBack}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="h2 fw-bold text-dark mb-0">{project.name}</h1>
        </div>
        {isOwner && (
          <button
            onClick={handleEdit}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <Edit size={20} />
            Editar
          </button>
        )}
      </div>

      {/* Project Overview Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-text text-muted small mb-1">Estado</p>
                  <div className="d-flex align-items-center gap-2">
                    {getStatusIcon(project.status)}
                    <p className="card-title h5 mb-0 fw-semibold">
                      {project.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-text text-muted small mb-1">
                    Duración Total
                  </p>
                  <p className="card-title h4 mb-0 fw-bold text-dark">
                    {project.total_duration} días
                  </p>
                </div>
                <Clock className="text-muted" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-text text-muted small mb-1">Fases</p>
                  <p className="card-title h4 mb-0 fw-bold text-dark">
                    {project.num_phases}
                  </p>
                </div>
                <TrendingUp className="text-muted" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div
            className={`card h-100 shadow-sm ${getDeviationColor(
              project.accumulated_deviation || 0
            )}`}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-text small mb-1 fw-medium">
                    Desviación Acumulada
                  </p>
                  <p className="card-title h4 mb-0 fw-bold">
                    {(project.accumulated_deviation || 0).toFixed(2)}%
                  </p>
                </div>
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          {["overview", "phases", "activities", "chart", "attention"].map(
            (tab) => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "overview" && "Resumen"}
                  {tab === "phases" && "Fases"}
                  {tab === "activities" && "Actividades"}
                  {tab === "chart" && "Gráfico de Progreso"}
                  {tab === "attention" && "Puntos de Atención"}
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="card shadow-sm">
        <div className="card-body">
          {activeTab === "overview" && (
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h3 className="h5 fw-semibold mb-4">Información General</h3>
                <div className="mb-3">
                  <p className="mb-2">
                    <span className="fw-medium">Inicio:</span>{" "}
                    {project.start_date
                      ? new Date(project.start_date).toLocaleDateString()
                      : "No definido"}
                  </p>
                  <p className="mb-2">
                    <span className="fw-medium">Fin:</span>{" "}
                    {project.end_date
                      ? new Date(project.end_date).toLocaleDateString()
                      : "No definido"}
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <h3 className="h5 fw-semibold mb-4">Indicadores</h3>
                <div className="mb-3">
                  <p className="mb-2">
                    <span className="fw-medium">Avance Planificado:</span>{" "}
                    {project.planned_progress || 0}%
                  </p>
                  <p className="mb-2">
                    <span className="fw-medium">Avance Real:</span>{" "}
                    {project.real_progress || 0}%
                  </p>
                  <p className="mb-2">
                    <span className="fw-medium">Cumplimiento:</span>{" "}
                    {project.compliance || 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "phases" && (
            <div>
              <h3 className="h5 fw-semibold mb-4">Fases del Proyecto</h3>
              <div className="row g-3">
                {project.phases &&
                  project.phases.map((phase, index) => (
                    <div key={index} className="col-12">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h4 className="h6 fw-medium mb-0">{phase.name}</h4>
                            <span className="badge bg-secondary">
                              Orden: {phase.order}
                            </span>
                          </div>

                          {/* Progress Bar Component */}
                          <PhaseProgressBar phase={phase} />

                          <div className="row g-3">
                            <div className="col-md-4">
                              <p className="mb-1">
                                <span className="fw-medium">Duración:</span>{" "}
                                {phase.duration} días
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p className="mb-1">
                                <span className="fw-medium">Inicio:</span>{" "}
                                {phase.start_date
                                  ? new Date(
                                      phase.start_date
                                    ).toLocaleDateString()
                                  : "No definido"}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p className="mb-1">
                                <span className="fw-medium">Fin:</span>{" "}
                                {phase.end_date
                                  ? new Date(
                                      phase.end_date
                                    ).toLocaleDateString()
                                  : "No definido"}
                              </p>
                            </div>
                          </div>

                          {/* Activities List */}
                          {phase.activities && phase.activities.length > 0 && (
                            <div className="mt-3">
                              <h6 className="fw-medium text-muted mb-2">
                                Actividades de la Fase:
                              </h6>
                              <div className="list-group list-group-flush">
                                {phase.activities.map(
                                  (
                                    activity // Quita activityIndex
                                  ) => (
                                    <div
                                      key={activity.id}
                                      className="list-group-item border-0 px-0 py-1"
                                    >
                                      <div className="d-flex align-items-center">
                                        {/* <span className="badge bg-primary me-2">
                            Actividad {activity.order || activity.id}
                        </span> */}
                                        <span className="fw-medium">
                                          {activity.description}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div>
              <h3 className="h5 fw-semibold mb-4">Actividades</h3>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-medium">Actividad</th>
                      <th className="fw-medium">Fase</th>
                      <th className="fw-medium">Duración</th>
                      <th className="fw-medium">Planificado %</th>
                      <th className="fw-medium">Real %</th>
                      
                      <th className="fw-medium">Desviación</th>
                      <th className="fw-medium">Fecha Finalización</th>
                      <th className="fw-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.phases &&
                      project.phases.flatMap((phase) =>
                        phase.activities
                          ? phase.activities.map((activity) => (
                              <tr
                                key={
                                  activity.id || `${phase.id}-${activity.id}`
                                }
                              >
                                <td className="fw-medium">
                                  {activity.description}
                                </td>
                                <td>{phase.name}</td>
                                <td>{activity.duration} días</td>
                                <td>
                                  {(activity.planned_percent || 0).toFixed(2)}%
                                </td>
                                <td>
                                  {(activity.real_percent || 0).toFixed(2)}%
                                </td>
                                
                                <td>
                                  {activity.deviation
                                    ? activity.deviation.toFixed(2)
                                    : 0}
                                  %
                                </td>
                                <td>
                                  {activity.completion_date
                                    ? new Date(
                                        activity.completion_date
                                      ).toLocaleDateString("es-ES")
                                    : "-"}
                                </td>
                                <td>
                                  {isOwner ? (
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => {
                                        setSelectedActivity(activity);
                                        setFulfillmentValue(
                                          activity.real_percent || 0
                                        );
                                        setCompletionDate(
                                          activity.completion_date
                                            ? new Date(activity.completion_date)
                                                .toISOString()
                                                .split("T")[0]
                                            : ""
                                        );
                                        setShowFulfillmentModal(true);
                                      }}
                                    >
                                      Agregar Cumplimiento
                                    </button>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          : []
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "chart" && (
            <div>
              <h3 className="h5 fw-semibold mb-4">
                Gráfico de Progreso (Curva S)
              </h3>
              <ProjectProgressChart project={project} />
            </div>
          )}

          {activeTab === "attention" && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-semibold mb-0">Puntos de Atención</h3>
                {isOwner && (
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => handleOpenAttentionModal()}
                  >
                    <Plus size={20} />
                    Agregar Punto
                  </button>
                )}
              </div>

              {attentionPoints.length === 0 ? (
                <div className="text-center py-5">
                  <AlertTriangle size={48} className="text-muted mb-3" />
                  <p className="text-muted">
                    No hay puntos de atención registrados
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {attentionPoints.map((point) => (
                    <div key={point.id} className="col-12">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <h5 className="card-title h6 fw-semibold mb-2">
                                {point.impacto}
                              </h5>
                              <p className="card-text small text-muted mb-2">
                                {point.acciones_ejecutar}
                              </p>
                              <div className="row g-2">
                                <div className="col-md-4">
                                  <small className="text-muted">
                                    <strong>Fecha Ocurrencia:</strong>{" "}
                                    {point.fecha_ocurrencia
                                      ? new Date(point.fecha_ocurrencia).toLocaleDateString()
                                      : "No definida"}
                                  </small>
                                </div>
                                <div className="col-md-4">
                                  <small className="text-muted">
                                    <strong>Fecha Solución:</strong>{" "}
                                    {point.fecha_solucion
                                      ? new Date(point.fecha_solucion).toLocaleDateString()
                                      : "No definida"}
                                  </small>
                                </div>
                                <div className="col-md-4">
                                  <small className="text-muted">
                                    <strong>Responsable:</strong>{" "}
                                    {point.responsable || "No asignado"}
                                  </small>
                                </div>
                              </div>
                            </div>
                            {isOwner && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleOpenAttentionModal(point)}
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteAttentionPoint(point.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fulfillment Modal */}
      {showFulfillmentModal && selectedActivity && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Cumplimiento</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowFulfillmentModal(false);
                    setSelectedActivity(null);
                    setFulfillmentValue("");
                    setCompletionDate("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Actividad:</strong> {selectedActivity.description}
                </p>
                <p>
                  <strong>Planificado:</strong>{" "}
                  {selectedActivity.planned_percent}%
                </p>
                <div className="mb-3">
                  <label className="form-label">Cumplimiento Real (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={fulfillmentValue}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFulfillmentValue(Math.min(value, 100));
                    }}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Finalización</label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowFulfillmentModal(false);
                    setSelectedActivity(null);
                    setFulfillmentValue("");
                    setCompletionDate("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    await handleUpdateCompliance(
                      selectedActivity.id,
                      fulfillmentValue,
                      completionDate
                    );
                    setShowFulfillmentModal(false);
                    setSelectedActivity(null);
                    setFulfillmentValue("");
                    setCompletionDate("");
                    // Refetch project to get updated completion_date
                    await fetchProject();
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attention Modal */}
      {showAttentionModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAttentionPoint ? "Editar Punto de Atención" : "Crear Punto de Atención"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAttentionModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Impacto *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={attentionForm.impacto}
                    onChange={(e) => setAttentionForm({ ...attentionForm, impacto: e.target.value })}
                    placeholder="Describe el impacto del punto de atención"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Acciones a Ejecutar *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={attentionForm.acciones_ejecutar}
                    onChange={(e) => setAttentionForm({ ...attentionForm, acciones_ejecutar: e.target.value })}
                    placeholder="Describe las acciones que se deben ejecutar"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Ocurrencia</label>
                    <input
                      type="date"
                      className="form-control"
                      value={attentionForm.fecha_ocurrencia}
                      onChange={(e) => setAttentionForm({ ...attentionForm, fecha_ocurrencia: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Solución</label>
                    <input
                      type="date"
                      className="form-control"
                      value={attentionForm.fecha_solucion}
                      onChange={(e) => setAttentionForm({ ...attentionForm, fecha_solucion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Responsable</label>
                  <input
                    type="text"
                    className="form-control"
                    value={attentionForm.responsable}
                    onChange={(e) => setAttentionForm({ ...attentionForm, responsable: e.target.value })}
                    placeholder="Nombre del responsable"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseAttentionModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAttentionPoint}
                >
                  {editingAttentionPoint ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
