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

    const calculateProjectProgress = () => {
        if (!project.phases || project.phases.length === 0) {
            return 0;
        }

        let totalCompliance = 0;
        let activityCount = 0;

        project.phases.forEach(phase => {
            if (phase.activities && phase.activities.length > 0) {
                phase.activities.forEach(activity => {
                    const compliance = activity.real_compliance || 0;
                    totalCompliance += compliance;
                    activityCount++;
                });
            }
        });

        return activityCount > 0 ? Math.round(totalCompliance / activityCount) : 0;
    };

    const getProgressBarColor = (progress) => {
        if (progress >= 80) return 'bg-success';
        if (progress >= 50) return 'bg-warning';
        if (progress >= 20) return 'bg-info';
        return 'bg-danger';
    };
console.log(project);
    const progress = calculateProjectProgress();

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
                        <strong>Fases:</strong> {project.num_phases}
                    </p>
                    <p className="card-text text-muted mb-1">
                        <strong>Duración total:</strong> {project.total_duration} días
                    </p>
                    {project.user && (
                        <p className="card-text text-muted mb-1">
                            <strong>Propietario:</strong> {project.user.username}
                        </p>
                    )}
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

                {/* Progress Bar Section */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold text-dark">Progreso del Proyecto</span>
                        <span className="fw-bold text-primary">{progress}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div
                            className={`progress-bar ${getProgressBarColor(progress)}`}
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
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
