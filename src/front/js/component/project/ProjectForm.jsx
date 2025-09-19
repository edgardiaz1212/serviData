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

    const calculateWorkingDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        let workingDays = 0;

        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            // Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                workingDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: value
            };

            // Auto-calculate total duration when start or end dates change
            if (name === 'start_date' || name === 'end_date') {
                if (updatedData.start_date && updatedData.end_date) {
                    updatedData.total_duration = calculateWorkingDays(updatedData.start_date, updatedData.end_date);
                }
            }

            return updatedData;
        });
    };

    const handlePhaseChange = (index, field, value) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[index] = { ...updatedPhases[index], [field]: value };

        // Auto-calculate phase duration when start or end dates change
        if (field === 'start_date' || field === 'end_date') {
            if (updatedPhases[index].start_date && updatedPhases[index].end_date) {
                updatedPhases[index].duration = calculateWorkingDays(updatedPhases[index].start_date, updatedPhases[index].end_date);
            }
        }

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
        <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Nombre del Proyecto
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Estructura EDT
                    </label>
                    <input
                        type="text"
                        name="edt_structure"
                        value={formData.edt_structure}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Número de Fases
                    </label>
                    <input
                        type="number"
                        name="num_phases"
                        value={formData.num_phases}
                        onChange={handleInputChange}
                        className="form-control"
                        min="1"
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Duración Total (días)
                    </label>
                    <input
                        type="number"
                        name="total_duration"
                        value={formData.total_duration}
                        className="form-control"
                        min="0"
                        readOnly
                        required
                    />
                    <small className="form-text text-muted">
                        Calculado automáticamente desde las fechas de inicio y fin
                    </small>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Fecha de Inicio
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                        Fecha de Fin
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
            </div>

            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h4 fw-semibold text-dark">Fases</h3>
                    <button
                        type="button"
                        onClick={addPhase}
                        className="btn btn-success"
                    >
                        Agregar Fase
                    </button>
                </div>

                {formData.phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="card border mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="h5 fw-medium mb-0">Fase {phaseIndex + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removePhase(phaseIndex)}
                                    className="btn btn-link text-danger p-0"
                                >
                                    Eliminar
                                </button>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-medium">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={phase.name}
                                        onChange={(e) => handlePhaseChange(phaseIndex, 'name', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-medium">
                                        Orden
                                    </label>
                                    <input
                                        type="number"
                                        value={phase.order}
                                        onChange={(e) => handlePhaseChange(phaseIndex, 'order', parseInt(e.target.value))}
                                        className="form-control"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-medium">
                                        Duración (días)
                                    </label>
                                    <input
                                        type="number"
                                        value={phase.duration}
                                        onChange={(e) => handlePhaseChange(phaseIndex, 'duration', parseInt(e.target.value))}
                                        className="form-control"
                                        min="0"
                                        required={!phase.start_date || !phase.end_date}
                                        readOnly={phase.start_date && phase.end_date}
                                    />
                                    {phase.start_date && phase.end_date && (
                                        <small className="form-text text-muted">
                                            Calculado automáticamente desde las fechas de inicio y fin
                                        </small>
                                    )}
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-medium">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        value={phase.start_date ? phase.start_date.split('T')[0] : ''}
                                        onChange={(e) => handlePhaseChange(phaseIndex, 'start_date', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-medium">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        value={phase.end_date ? phase.end_date.split('T')[0] : ''}
                                        onChange={(e) => handlePhaseChange(phaseIndex, 'end_date', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-medium text-muted mb-0">Actividades</h5>
                                    <button
                                        type="button"
                                        onClick={() => addActivity(phaseIndex)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Agregar Actividad
                                    </button>
                                </div>

                                {phase.activities && phase.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="card border mb-2 bg-light">
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium">Actividad {activityIndex + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeActivity(phaseIndex, activityIndex)}
                                                    className="btn btn-link text-danger p-0"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>

                                            <div className="row g-3">
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium small">
                                                        Descripción
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={activity.description}
                                                        onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'description', e.target.value)}
                                                        className="form-control form-control-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium small">
                                                        Duración (días)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={activity.duration}
                                                        onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'duration', parseInt(e.target.value))}
                                                        className="form-control form-control-sm"
                                                        min="0"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium small">
                                                        Predecesores
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={activity.predecessors || ''}
                                                        onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'predecessors', e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium small">
                                                        Inicio Planificado
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={activity.planned_start ? activity.planned_start.split('T')[0] : ''}
                                                        onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'planned_start', e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium small">
                                                        Fin Planificado
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={activity.planned_end ? activity.planned_end.split('T')[0] : ''}
                                                        onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'planned_end', e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline-secondary"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
