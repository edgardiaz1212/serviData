import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext.js';
import ProjectProgressChart from '../component/project/ProjectProgressChart.jsx';
import { ArrowLeft, Edit, Plus, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { actions } = useContext(Context);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id && id !== 'new') {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const data = await actions.fetchProjectById(id);
            if (data) {
                setProject(data);
            } else {
                toast.error('Error al obtener el proyecto');
            }
        } catch (error) {
            toast.error('Error al obtener el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/projects/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/projects');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'En progreso':
                return <Clock className="text-blue-500" size={20} />;
            case 'Completado':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'Retrasado':
                return <AlertTriangle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getDeviationColor = (deviation) => {
        if (deviation < -10) return 'text-red-600 bg-red-50';
        if (deviation > 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
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
                <button
                    onClick={handleBack}
                    className="btn btn-primary"
                >
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
                <button
                    onClick={handleEdit}
                    className="btn btn-primary d-flex align-items-center gap-2"
                >
                    <Edit size={20} />
                    Editar
                </button>
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
                                        <p className="card-title h5 mb-0 fw-semibold">{project.status}</p>
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
                                    <p className="card-text text-muted small mb-1">Duración Total</p>
                                    <p className="card-title h4 mb-0 fw-bold text-dark">{project.total_duration} días</p>
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
                                    <p className="card-title h4 mb-0 fw-bold text-dark">{project.num_phases}</p>
                                </div>
                                <TrendingUp className="text-muted" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className={`card h-100 shadow-sm ${getDeviationColor(project.accumulated_deviation || 0)}`}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text small mb-1 fw-medium">Desviación Acumulada</p>
                                    <p className="card-title h4 mb-0 fw-bold">{(project.accumulated_deviation || 0).toFixed(2)}%</p>
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
                    {['overview', 'phases', 'activities', 'chart', 'attention'].map((tab) => (
                        <li key={tab} className="nav-item">
                            <button
                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'overview' && 'Resumen'}
                                {tab === 'phases' && 'Fases'}
                                {tab === 'activities' && 'Actividades'}
                                {tab === 'chart' && 'Gráfico de Progreso'}
                                {tab === 'attention' && 'Puntos de Atención'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tab Content */}
            <div className="card shadow-sm">
                <div className="card-body">
                    {activeTab === 'overview' && (
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <h3 className="h5 fw-semibold mb-4">Información General</h3>
                                <div className="mb-3">
                                    <p className="mb-2"><span className="fw-medium">EDT:</span> {project.edt_structure}</p>
                                    <p className="mb-2"><span className="fw-medium">Inicio:</span> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definido'}</p>
                                    <p className="mb-2"><span className="fw-medium">Fin:</span> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No definido'}</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h3 className="h5 fw-semibold mb-4">Indicadores</h3>
                                <div className="mb-3">
                                    <p className="mb-2"><span className="fw-medium">Progreso Planificado:</span> {project.planned_progress || 0}%</p>
                                    <p className="mb-2"><span className="fw-medium">Progreso Real:</span> {project.real_progress || 0}%</p>
                                    <p className="mb-2"><span className="fw-medium">Cumplimiento:</span> {project.compliance || 0}%</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'phases' && (
                        <div>
                            <h3 className="h5 fw-semibold mb-4">Fases del Proyecto</h3>
                            <div className="row g-3">
                                {project.phases && project.phases.map((phase, index) => (
                                    <div key={index} className="col-12">
                                        <div className="card border">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h4 className="h6 fw-medium mb-0">{phase.name}</h4>
                                                    <span className="badge bg-secondary">Orden: {phase.order}</span>
                                                </div>
                                                <div className="row g-3">
                                                    <div className="col-md-4">
                                                        <p className="mb-1"><span className="fw-medium">Duración:</span> {phase.duration} días</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p className="mb-1"><span className="fw-medium">Inicio:</span> {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : 'No definido'}</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p className="mb-1"><span className="fw-medium">Fin:</span> {phase.end_date ? new Date(phase.end_date).toLocaleDateString() : 'No definido'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'activities' && (
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.phases && project.phases.flatMap(phase =>
                                            phase.activities ? phase.activities.map((activity, index) => (
                                                <tr key={`${phase.id}-${index}`}>
                                                    <td className="fw-medium">{activity.description}</td>
                                                    <td>{phase.name}</td>
                                                    <td>{activity.duration} días</td>
                                                    <td>{activity.planned_percent || 0}%</td>
                                                    <td>{activity.real_percent || 0}%</td>
                                                    <td>{activity.deviation ? activity.deviation.toFixed(2) : 0}%</td>
                                                </tr>
                                            )) : []
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chart' && (
                        <div>
                            <h3 className="h5 fw-semibold mb-4">Gráfico de Progreso (Curva S)</h3>
                            <ProjectProgressChart project={project} />
                        </div>
                    )}

                    {activeTab === 'attention' && (
                        <div>
                            <h3 className="h5 fw-semibold mb-4">Puntos de Atención</h3>
                            <div className="text-center py-5">
                                <AlertTriangle size={48} className="text-muted mb-3" />
                                <p className="text-muted">No hay puntos de atención registrados</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
