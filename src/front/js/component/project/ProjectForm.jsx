import React, { useState, useEffect } from 'react';

const ProjectForm = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        edt_structure: '',
        num_phases: 1,
        start_date: '',
        end_date: '',
        total_duration: 0,
        phases: []
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                edt_structure: project.edt_structure || '',
                num_phases: project.num_phases || 1,
                start_date: project.start_date ? project.start_date.split('T')[0] : '',
                end_date: project.end_date ? project.end_date.split('T')[0] : '',
                total_duration: project.total_duration || 0,
                phases: project.phases || []
            });
        }
    }, [project]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhaseChange = (index, field, value) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[index] = { ...updatedPhases[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const addPhase = () => {
        const newPhase = {
            name: '',
            order: formData.phases.length + 1,
            start_date: '',
            end_date: '',
            duration: 0,
            activities: []
        };
        setFormData(prev => ({
            ...prev,
            phases: [...prev.phases, newPhase]
        }));
    };

    const removePhase = (index) => {
        const updatedPhases = formData.phases.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const addActivity = (phaseIndex) => {
        const updatedPhases = [...formData.phases];
        const newActivity = {
            description: '',
            duration: 0,
            predecessors: '',
            planned_start: '',
            planned_end: ''
        };
        updatedPhases[phaseIndex].activities = [...(updatedPhases[phaseIndex].activities || []), newActivity];
        setFormData(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const removeActivity = (phaseIndex, activityIndex) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[phaseIndex].activities = updatedPhases[phaseIndex].activities.filter((_, i) => i !== activityIndex);
        setFormData(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const handleActivityChange = (phaseIndex, activityIndex, field, value) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[phaseIndex].activities[activityIndex] = {
            ...updatedPhases[phaseIndex].activities[activityIndex],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            phases: updatedPhases
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Proyecto
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estructura EDT
                    </label>
                    <input
                        type="text"
                        name="edt_structure"
                        value={formData.edt_structure}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Fases
                    </label>
                    <input
                        type="number"
                        name="num_phases"
                        value={formData.num_phases}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duración Total (días)
                    </label>
                    <input
                        type="number"
                        name="total_duration"
                        value={formData.total_duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Fin
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Fases</h3>
                    <button
                        type="button"
                        onClick={addPhase}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Agregar Fase
                    </button>
                </div>

                {formData.phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-medium">Fase {phaseIndex + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removePhase(phaseIndex)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Eliminar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={phase.name}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Orden
                                </label>
                                <input
                                    type="number"
                                    value={phase.order}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'order', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duración (días)
                                </label>
                                <input
                                    type="number"
                                    value={phase.duration}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'duration', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    value={phase.start_date ? phase.start_date.split('T')[0] : ''}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    value={phase.end_date ? phase.end_date.split('T')[0] : ''}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'end_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">Actividades</h5>
                                <button
                                    type="button"
                                    onClick={() => addActivity(phaseIndex)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    Agregar Actividad
                                </button>
                            </div>

                            {phase.activities && phase.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="border border-gray-100 rounded p-3 mb-2 bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Actividad {activityIndex + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeActivity(phaseIndex, activityIndex)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <input
                                                type="text"
                                                value={activity.description}
                                                onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'description', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Duración (días)
                                            </label>
                                            <input
                                                type="number"
                                                value={activity.duration}
                                                onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'duration', parseInt(e.target.value))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Predecesores
                                            </label>
                                            <input
                                                type="text"
                                                value={activity.predecessors || ''}
                                                onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'predecessors', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Inicio Planificado
                                            </label>
                                            <input
                                                type="date"
                                                value={activity.planned_start ? activity.planned_start.split('T')[0] : ''}
                                                onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'planned_start', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Fin Planificado
                                            </label>
                                            <input
                                                type="date"
                                                value={activity.planned_end ? activity.planned_end.split('T')[0] : ''}
                                                onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'planned_end', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
