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
            <h6 className="mb-3">Timeline del Proyecto</h6>
            <div className="timeline-container position-relative" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', borderRadius: '4px', padding: '5px' }}>
                {sortedPhases.map((phase, index) => {
                    if (!phase.start_date || !phase.end_date) return null;

                    const phaseStart = new Date(phase.start_date);
                    const phaseEnd = new Date(phase.end_date);
                    const phaseDuration = phaseEnd - phaseStart;

                    if (phaseDuration <= 0) return null;

                    const leftPercent = ((phaseStart - projectStart) / totalDuration) * 100;
                    const widthPercent = (phaseDuration / totalDuration) * 100;

                    const phaseColor = colors[index % colors.length];
                    const darkerColor = phaseColor; // or calculate darker

                    return (
                        <div
                            key={index}
                            className="phase-bar position-absolute"
                            style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                                top: '5px',
                                height: '30px',
                                backgroundColor: phaseColor,
                                borderRadius: '2px',
                                border: '1px solid #fff',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                padding: '2px'
                            }}
                            title={`${phase.name}: ${phase.start_date} - ${phase.end_date}`}
                        >
                            <div>{phase.name}</div>
                            {/* Activities within phase */}
                            {phase.activities && phase.activities.length > 0 && (
                                <div className="activities-container position-relative w-100" style={{ height: '10px', marginTop: '2px' }}>
                                    {phase.activities.map((activity, actIndex) => {
                                        if (!activity.planned_start || !activity.planned_end) return null;

                                        const actStart = new Date(activity.planned_start);
                                        const actEnd = new Date(activity.planned_end);
                                        const actDuration = actEnd - actStart;

                                        if (actDuration <= 0) return null;

                                        const actLeftPercent = ((actStart - phaseStart) / phaseDuration) * 100;
                                        const actWidthPercent = (actDuration / phaseDuration) * 100;

                                        return (
                                            <div
                                                key={actIndex}
                                                className="activity-bar position-absolute"
                                                style={{
                                                    left: `${actLeftPercent}%`,
                                                    width: `${actWidthPercent}%`,
                                                    height: '8px',
                                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '1px',
                                                    top: '1px'
                                                }}
                                                title={`${activity.description}: ${activity.planned_start} - ${activity.planned_end}`}
                                            ></div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">{project.start_date}</small>
                <small className="text-muted">{project.end_date}</small>
            </div>
        </div>
    );
};

export default ProjectTimelineChart;
