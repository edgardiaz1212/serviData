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

            {/* Planned Progress Bar */}
            <div className="progress mb-2" style={{ height: '6px' }}>
                <div
                    className={`progress-bar ${getProgressBarColor(plannedProgress)}`}
                    role="progressbar"
                    style={{ width: `${plannedProgress}%` }}
                    aria-valuenow={plannedProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>

            {/* Real Progress Bar (lighter, as reference) */}
            <div className="progress" style={{ height: '6px', opacity: 0.6 }}>
                <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{ width: `${realProgress}%` }}
                    aria-valuenow={realProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>

            {/* Activities Summary */}
            {phase.activities && phase.activities.length > 0 && (
                <div className="mt-2">
                    <small className="text-muted">
                        {phase.activities.length} actividad{phase.activities.length !== 1 ? 'es' : ''}
                    </small>
                </div>
            )}
        </div>
    );
};

export default PhaseProgressBar;
