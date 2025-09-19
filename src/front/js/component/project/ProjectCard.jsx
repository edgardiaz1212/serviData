import React from 'react';

const ProjectCard = ({ project, onViewDetails }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'En progreso':
                return 'bg-primary';
            case 'Completado':
                return 'bg-success';
            case 'Retrasado':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const getDeviationColor = (deviation) => {
        if (deviation < -10) return 'text-danger';
        if (deviation > 10) return 'text-warning';
        return 'text-success';
    };

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold text-dark">{project.name}</h5>
                    <span className={`badge ${getStatusColor(project.status)} text-white`}>
                        {project.status}
                    </span>
                </div>

                <div className="mb-3">
                    <p className="card-text text-muted mb-1">
                        <strong>EDT:</strong> {project.edt_structure}
                    </p>
                    <p className="card-text text-muted mb-1">
                        <strong>Fases:</strong> {project.num_phases}
                    </p>
                    <p className="card-text text-muted mb-1">
                        <strong>Duración total:</strong> {project.total_duration} días
                    </p>
                    {project.start_date && (
                        <p className="card-text text-muted mb-1">
                            <strong>Inicio:</strong> {new Date(project.start_date).toLocaleDateString()}
                        </p>
                    )}
                    {project.end_date && (
                        <p className="card-text text-muted mb-1">
                            <strong>Fin:</strong> {new Date(project.end_date).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {project.phases && project.phases.length > 0 && (
                    <div className="mb-3">
                        <h6 className="fw-semibold text-dark mb-2">Fases:</h6>
                        <div>
                            {project.phases.slice(0, 3).map((phase, index) => (
                                <div key={index} className="small text-muted">
                                    {phase.name} ({phase.duration} días)
                                </div>
                            ))}
                            {project.phases.length > 3 && (
                                <div className="small text-muted">
                                    +{project.phases.length - 3} más...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                    <button
                        onClick={() => onViewDetails(project.id)}
                        className="btn btn-primary"
                    >
                        Ver Detalles
                    </button>
                    {project.accumulated_deviation !== undefined && (
                        <span className={`small fw-medium ${getDeviationColor(project.accumulated_deviation)}`}>
                            Desviación: {project.accumulated_deviation.toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
