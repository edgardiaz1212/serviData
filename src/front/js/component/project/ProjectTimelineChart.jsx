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
            <div className="timeline-container position-relative" style={{ height: '40px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                {sortedPhases.map((phase, index) => {
                    if (!phase.start_date || !phase.end_date) return null;

                    const phaseStart = new Date(phase.start_date);
                    const phaseEnd = new Date(phase.end_date);
                    const phaseDuration = phaseEnd - phaseStart;

                    if (phaseDuration <= 0) return null;

                    const leftPercent = ((phaseStart - projectStart) / totalDuration) * 100;
                    const widthPercent = (phaseDuration / totalDuration) * 100;

                    return (
                        <div
                            key={index}
                            className="phase-bar position-absolute d-flex align-items-center justify-content-center"
                            style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                                height: '100%',
                                backgroundColor: colors[index % colors.length],
                                borderRadius: '2px',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                padding: '0 2px'
                            }}
                            title={`${phase.name}: ${phase.start_date} - ${phase.end_date}`}
                        >
                            {phase.name}
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
