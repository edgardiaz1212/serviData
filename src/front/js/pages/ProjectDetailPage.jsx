import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';

const ProjectDetailPage = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const data = await actions.getProjectById(id);
            if (data) {
                setProject(data);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    const getProjectStatus = (project) => {
        if (project.avance_real >= 100) return 'Completado';
        if (project.avance_real > 80) return 'Por Completar';
        return 'En Progreso';
    };

    const getCurrentPhase = (project) => {
        if (!project.phases || project.phases.length === 0) return 'Sin Fases';

        // Sort phases by name assuming they are named FASE I, FASE II, etc.
        const sortedPhases = project.phases.sort((a, b) => {
            const numA = parseInt(a.name.replace('FASE ', '')) || 0;
            const numB = parseInt(b.name.replace('FASE ', '')) || 0;
            return numA - numB;
        });

        // Find the last phase with activities that have progress
        for (let i = sortedPhases.length - 1; i >= 0; i--) {
            const phase = sortedPhases[i];
            if (phase.activities && phase.activities.some(activity => activity.avance_real > 0)) {
                return phase.name;
            }
        }

        // If no activities have progress, return the first phase
        return sortedPhases[0].name;
    };

    if (loading) {
        return <div className="text-center p-4">Cargando detalles del proyecto...</div>;
    }

    if (!project) {
        return <div className="text-center p-4">Proyecto no encontrado.</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{project.name}</h1>
                <div>
                    <Link to="/projects" className="btn btn-secondary me-2">
                        Volver a Proyectos
                    </Link>
                    <Link to={`/edit-project/${project.id}`} className="btn btn-primary">
                        Editar Proyecto
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Información General</h5>
                            <p className="card-text">{project.description}</p>
                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Estado:</strong>
                                    <span className={`badge ms-2 ${
                                        getProjectStatus(project) === 'Completado' ? 'bg-success' :
                                        getProjectStatus(project) === 'Por Completar' ? 'bg-warning' :
                                        'bg-info'
                                    }`}>
                                        {getProjectStatus(project)}
                                    </span>
                                </div>
                                <div className="col-md-6">
                                    <strong>Fase Actual:</strong> {getCurrentPhase(project)}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <strong>Avance Real:</strong> {project.avance_real}%
                                </div>
                                <div className="col-md-6">
                                    <strong>Avance Planeado:</strong> {project.avance_planeado || 0}%
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <strong>Fecha de Inicio:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="col-md-6">
                                    <strong>Fecha de Fin:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Fases y Actividades</h5>
                            {project.phases && project.phases.length > 0 ? (
                                project.phases
                                    .sort((a, b) => {
                                        const numA = parseInt(a.name.replace('FASE ', '')) || 0;
                                        const numB = parseInt(b.name.replace('FASE ', '')) || 0;
                                        return numA - numB;
                                    })
                                    .map((phase) => (
                                        <div key={phase.id} className="mb-4">
                                            <h6 className="text-primary">{phase.name}</h6>
                                            <p className="text-muted">{phase.description}</p>
                                            {phase.activities && phase.activities.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Actividad</th>
                                                                <th>Avance Real</th>
                                                                <th>Avance Planeado</th>
                                                                <th>Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {phase.activities.map((activity) => (
                                                                <tr key={activity.id}>
                                                                    <td>{activity.name}</td>
                                                                    <td>{activity.avance_real}%</td>
                                                                    <td>{activity.avance_planeado || 0}%</td>
                                                                    <td>
                                                                        <span className={`badge ${
                                                                            activity.avance_real >= 100 ? 'bg-success' :
                                                                            activity.avance_real > 0 ? 'bg-warning' :
                                                                            'bg-secondary'
                                                                        }`}>
                                                                            {activity.avance_real >= 100 ? 'Completada' :
                                                                             activity.avance_real > 0 ? 'En Progreso' :
                                                                             'Pendiente'}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-muted">No hay actividades en esta fase.</p>
                                            )}
                                        </div>
                                    ))
                            ) : (
                                <p className="text-muted">No hay fases definidas para este proyecto.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Progreso General</h5>
                            <div className="mb-3">
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${project.avance_real}%` }}
                                        aria-valuenow={project.avance_real}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {project.avance_real}%
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted">
                                {project.avance_real >= 100 ? 'Proyecto completado' :
                                 project.avance_real > 80 ? 'Próximo a completarse' :
                                 'En desarrollo'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
