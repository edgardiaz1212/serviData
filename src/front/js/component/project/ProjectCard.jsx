import React from 'react';

const ProjectCard = ({ project, onViewDetails }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'En progreso':
                return 'bg-blue-500';
            case 'Completado':
                return 'bg-green-500';
            case 'Retrasado':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getDeviationColor = (deviation) => {
        if (deviation < -10) return 'text-red-600';
        if (deviation > 10) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                    <span className="font-medium">EDT:</span> {project.edt_structure}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Fases:</span> {project.num_phases}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Duración total:</span> {project.total_duration} días
                </p>
                {project.start_date && (
                    <p className="text-gray-600">
                        <span className="font-medium">Inicio:</span> {new Date(project.start_date).toLocaleDateString()}
                    </p>
                )}
                {project.end_date && (
                    <p className="text-gray-600">
                        <span className="font-medium">Fin:</span> {new Date(project.end_date).toLocaleDateString()}
                    </p>
                )}
            </div>

            {project.phases && project.phases.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Fases:</h4>
                    <div className="space-y-1">
                        {project.phases.slice(0, 3).map((phase, index) => (
                            <div key={index} className="text-sm text-gray-600">
                                {phase.name} ({phase.duration} días)
                            </div>
                        ))}
                        {project.phases.length > 3 && (
                            <div className="text-sm text-gray-500">
                                +{project.phases.length - 3} más...
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <button
                    onClick={() => onViewDetails(project.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Ver Detalles
                </button>
                {project.accumulated_deviation !== undefined && (
                    <span className={`text-sm font-medium ${getDeviationColor(project.accumulated_deviation)}`}>
                        Desviación: {project.accumulated_deviation.toFixed(2)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
