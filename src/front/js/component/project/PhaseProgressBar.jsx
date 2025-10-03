import React from 'react';

const PhaseProgressBar = ({ phase }) => {
    const calculatePhaseProgress = () => {
        if (!phase.activities || phase.activities.length === 0) {
            return 0;
        }

        let totalCompliance = 0;

        phase.activities.forEach(activity => {
            const compliance = activity.real_compliance || 0;
            totalCompliance += compliance;
        });

        return Math.round(totalCompliance);
    };

    const calculatePlannedProgress = () => {
        if (!phase.activities || phase.activities.length === 0) {
            return 0;
        }

        let totalPlanned = 0;

        phase.activities.forEach(activity => {
            const planned = activity.planned_percent || 0;
            totalPlanned += planned;
        });

        return Math.round(totalPlanned);
    };

    const getProgressBarColor = (progress) => {
        if (progress >= 80) return 'bg-success';
        if (progress >= 50) return 'bg-warning';
        if (progress >= 20) return 'bg-info';
        return 'bg-danger';
    };

    const realProgress = calculatePhaseProgress();
    const plannedProgress = calculatePlannedProgress();

    // Calcular el porcentaje de la barra real en relación al planificado
    const realBarPercentage = plannedProgress > 0 ? (realProgress / plannedProgress) * 100 : 0;
    const plannedBarPercentage = 100; // La barra planificada siempre es el 100% de sí misma

    // Calcular porcentaje de la fase completada
    const phaseCompletionPercentage = plannedProgress > 0 ? (realProgress / plannedProgress) * 100 : 0;

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-dark">Progreso de la Fase</span>
                <div className="d-flex gap-3">
                    <small className="text-muted">
                        Planificado: <span className="fw-medium">{plannedProgress}%</span>
                    </small>
                    <small className="text-primary fw-medium">
                        Real: {realProgress}%
                    </small>
                </div>
            </div>

            {/* Planned Progress Bar (siempre al 100% de esta fase) */}
            <div className="progress mb-2" style={{ height: '6px', opacity: 0.4 }}>
                <div
                    className="progress-bar bg-light"
                    role="progressbar"
                    style={{ width: `${plannedBarPercentage}%` }}
                    aria-valuenow={plannedProgress}
                    aria-valuemin="0"
                    aria-valuemax={plannedProgress}
                ></div>
            </div>

            {/* Real Progress Bar (proporcional al planificado) */}
            <div className="progress" style={{ height: '6px' }}>
                <div
                    className={`progress-bar ${getProgressBarColor(realProgress)}`}
                    role="progressbar"
                    style={{ width: `${Math.min(realBarPercentage, 100)}%` }}
                    aria-valuenow={realProgress}
                    aria-valuemin="0"
                    aria-valuemax={plannedProgress}
                ></div>
            </div>

            {/* Activities Summary + Phase Completion */}
            <div className="mt-2">
                <small className="text-muted">
                    {phase.activities && phase.activities.length > 0 && (
                        <>
                            {phase.activities.length} actividad{phase.activities.length !== 1 ? 'es' : ''} •{' '}
                        </>
                    )}
                    <span>
                        {realProgress} de {plannedProgress} completado ({phaseCompletionPercentage.toFixed(1)}% de la fase)
                    </span>
                </small>
            </div>
        </div>
    );
};

export default PhaseProgressBar;