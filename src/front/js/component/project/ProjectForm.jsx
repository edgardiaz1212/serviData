import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';

const ProjectForm = ({ projectId }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'En Progreso',
        avance_real: 0,
        phases: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (projectId) {
            const fetchProject = async () => {
                const project = await actions.getProjectById(projectId);
                if (project) {
                    setFormData({
                        name: project.name || '',
                        description: project.description || '',
                        start_date: project.start_date ? project.start_date.split('T')[0] : '',
                        end_date: project.end_date ? project.end_date.split('T')[0] : '',
                        status: project.status || 'En Progreso',
                        avance_real: project.avance_real || 0,
                        phases: project.phases || []
                    });
                }
            };
            fetchProject();
        }
    }, [projectId]);

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
        setFormData(prev => ({
            ...prev,
            phases: [...prev.phases, {
                name: '',
                wbs_code: '',
                start_date: '',
                end_date: '',
                weight: 0,
                avance_real: 0,
                activities: []
            }]
        }));
    };

    const removePhase = (index) => {
        const updatedPhases = formData.phases.filter((_, i) => i !== index);
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

    const addActivity = (phaseIndex) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[phaseIndex].activities = [...(updatedPhases[phaseIndex].activities || []), {
            name: '',
            wbs_code: '',
            duration_days: 0,
            start_date: '',
            end_date: '',
            predecessors: '',
            weight: 0,
            avance_real: 0
        }];
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (projectId) {
                await actions.updateProject(projectId, formData);
            } else {
                await actions.createProject(formData);
            }
            navigate('/projects');
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1>{projectId ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre del Proyecto</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                    />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="start_date" className="form-label">Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="end_date" className="form-label">Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="status" className="form-label">Estado</label>
                        <select
                            className="form-select"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="En Progreso">En Progreso</option>
                            <option value="Por Completar">Por Completar</option>
                            <option value="Completado">Completado</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="avance_real" className="form-label">Avance Real (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="avance_real"
                            name="avance_real"
                            value={formData.avance_real}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>

                <h3>Fases</h3>
                {formData.phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="border p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Fase {phaseIndex + 1}</h4>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removePhase(phaseIndex)}
                            >
                                Eliminar Fase
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre de la Fase</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phase.name}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Código WBS</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phase.wbs_code}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'wbs_code', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={phase.start_date ? phase.start_date.split('T')[0] : ''}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'start_date', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha de Fin</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={phase.end_date ? phase.end_date.split('T')[0] : ''}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'end_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Peso (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={phase.weight}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'weight', parseFloat(e.target.value))}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Avance Real (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={phase.avance_real}
                                    onChange={(e) => handlePhaseChange(phaseIndex, 'avance_real', parseFloat(e.target.value))}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <h5>Actividades</h5>
                        {phase.activities && phase.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="border p-2 mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6>Actividad {activityIndex + 1}</h6>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeActivity(phaseIndex, activityIndex)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={activity.name}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Código WBS</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={activity.wbs_code}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'wbs_code', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Duración (días)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={activity.duration_days}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'duration_days', parseInt(e.target.value))}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Predecesores</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={activity.predecessors}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'predecessors', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={activity.start_date ? activity.start_date.split('T')[0] : ''}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={activity.end_date ? activity.end_date.split('T')[0] : ''}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'end_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Peso (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={activity.weight}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'weight', parseFloat(e.target.value))}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Avance Real (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={activity.avance_real}
                                            onChange={(e) => handleActivityChange(phaseIndex, activityIndex, 'avance_real', parseFloat(e.target.value))}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => addActivity(phaseIndex)}
                        >
                            Agregar Actividad
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={addPhase}
                >
                    Agregar Fase
                </button>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Guardando...' : (projectId ? 'Actualizar Proyecto' : 'Crear Proyecto')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
