import React from 'react';

const ProjectTimelineChart = ({ project, phases }) => {
    // Use phases from formData if available, else from project
    const phaseList = phases || (project ? project.phases : []) || [];

    if (!project || !project.start_date || !project.end_date) {
        return (
            <div className="text-center text-muted p-3">
                <small>Configure las fechas del proyecto para ver el timeline</small>
            </div>
        );
    }

    const projectStart = new Date(project.start_date);
    const projectEnd = new Date(project.end_date);
    const totalDuration = projectEnd - projectStart;

    if (totalDuration <= 0) {
        return (
            <div className="text-center text-muted p-3">
                <small>Fechas del proyecto inválidas</small>
            </div>
        );
    }

    // Colors for phases
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];

    const sortedPhases = [...phaseList].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    return (
        <div className="project-timeline">
            <h6 className="mb-3">Timeline del Proyecto (Gantt Estilo)</h6>
            <div className="timeline-container" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', padding: '10px' }}>
                {/* Project timeline header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted fw-bold">Proyecto: {project.name || 'Proyecto'}</small>
                    <div className="d-flex justify-content-between w-100 mx-3">
                        <small className="text-muted">{project.start_date}</small>
                        <small className="text-muted">{project.end_date}</small>
                    </div>
                </div>
                {/* Stacked phases */}
                <div className="phases-stack">
                    {sortedPhases.map((phase, index) => {
                        if (!phase.start_date || !phase.end_date) return null;

                        const phaseStart = new Date(phase.start_date);
                        const phaseEnd = new Date(phase.end_date);
                        const phaseDuration = phaseEnd - phaseStart;

                        if (phaseDuration <= 0) return null;

                        const phaseColor = colors[index % colors.length];

                        return (
                            <div key={index} className="phase-row mb-3" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                {/* Phase label */}
                                <div className="phase-label me-3" style={{ minWidth: '120px', fontSize: '12px', fontWeight: 'bold', color: phaseColor }}>
                                    Fase {phase.order || index + 1}: {phase.name}
                                </div>
                                {/* Phase bar container */}
                                <div className="phase-bar-container position-relative flex-grow-1" style={{ height: '40px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                                    {/* Phase background bar */}
                                    <div
                                        className="position-absolute"
                                        style={{
                                            left: `${((phaseStart - projectStart) / totalDuration) * 100}%`,
                                            width: `${(phaseDuration / totalDuration) * 100}%`,
                                            height: '100%',
                                            backgroundColor: phaseColor + '20', // Semi-transparent
                                            borderLeft: `2px solid ${phaseColor}`,
                                            borderRight: `2px solid ${phaseColor}`
                                        }}
                                    />
                                    {/* Activities within phase */}
                                    {phase.activities && phase.activities.length > 0 ? (
                                        phase.activities.map((activity, actIndex) => {
                                            if (!activity.planned_start || !activity.planned_end) return null;

                                            const actStart = new Date(activity.planned_start);
                                            const actEnd = new Date(activity.planned_end);
                                            const actDuration = actEnd - actStart;

                                            if (actDuration <= 0 || actStart < phaseStart || actEnd > phaseEnd) return null;

                                            const phaseLeft = ((phaseStart - projectStart) / totalDuration) * 100;
                                            const phaseWidth = (phaseDuration / totalDuration) * 100;
                                            const relativeActLeft = ((actStart - phaseStart) / phaseDuration) * phaseWidth;
                                            const relativeActWidth = (actDuration / phaseDuration) * phaseWidth;

                                            const actLeft = phaseLeft + relativeActLeft;
                                            const actWidth = relativeActWidth;

                                            return (
                                                <div
                                                    key={actIndex}
                                                    className="activity-bar position-absolute"
                                                    style={{
                                                        left: `${actLeft}%`,
                                                        width: `${actWidth}%`,
                                                        height: '70%',
                                                        backgroundColor: phaseColor,
                                                        borderRadius: '2px',
                                                        top: '15%',
                                                        border: '1px solid #fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '8px',
                                                        color: 'white',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        padding: '0 2px'
                                                    }}
                                                    title={`${activity.description}: ${activity.planned_start} - ${activity.planned_end} (${activity.duration} días)`}
                                                >
                                                    {activity.description.length > 10 ? `${activity.description.substring(0, 10)}...` : activity.description}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="position-absolute top-50 start-50 translate-middle text-muted small">
                                            Sin actividades
                                        </div>
                                    )}
                                </div>
                                {/* Phase dates */}
                                <div className="ms-3 text-muted small" style={{ minWidth: '100px', textAlign: 'right' }}>
                                    {phase.start_date.split('T')[0]} - {phase.end_date.split('T')[0]}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {sortedPhases.length === 0 && (
                    <div className="text-center text-muted py-4">
                        <small>Agrega fases para ver el timeline</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectTimelineChart;
