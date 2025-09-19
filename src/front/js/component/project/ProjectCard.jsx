import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
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

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="card-text">{project.description}</p>
                    <div className="mb-2">
                        <strong>Estado:</strong>
                        <span className={`badge ms-2 ${
                            getProjectStatus(project) === 'Completado' ? 'bg-success' :
                            getProjectStatus(project) === 'Por Completar' ? 'bg-warning' :
                            'bg-info'
                        }`}>
                            {getProjectStatus(project)}
                        </span>
                    </div>
                    <div className="mb-2">
                        <strong>Fase Actual:</strong> {getCurrentPhase(project)}
                    </div>
                    <div className="mb-2">
                        <strong>Avance Real:</strong> {project.avance_real}%
                    </div>
                    <div className="mb-3">
                        <strong>Fechas:</strong>
                        <br />
                        Inicio: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                        <br />
                        Fin: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
                <div className="card-footer">
                    <Link to={`/project/${project.id}`} className="btn btn-outline-primary me-2">
                        Ver Detalles
                    </Link>
                    <Link to={`/edit-project/${project.id}`} className="btn btn-outline-secondary">
                        Editar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
