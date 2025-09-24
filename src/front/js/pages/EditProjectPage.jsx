import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext.js';
import ProjectForm from '../component/project/ProjectForm.jsx';
import { ArrowLeft, Save } from 'lucide-react';

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { actions } = useContext(Context);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isNewProject = !id;
    useEffect(() => {
        if (!isNewProject) {
            fetchProject();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const data = await actions.fetchProjectById(id);
            if (data) {
                setProject(data);
            } else {
                console.error('Error fetching project');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            let savedProject;
            if (isNewProject) {
                savedProject = await actions.createProject(formData);
                console.log('Project creation response:', savedProject); // Debug logging
            } else {
                savedProject = await actions.updateProject(id, formData);
                console.log('Project update response:', savedProject); // Debug logging
            }

            // Debug: Log the exact structure of the response
            console.log('Full response structure:', JSON.stringify(savedProject, null, 2));

            // Handle nested response structure from backend
            let projectId;
            if (savedProject && savedProject.project && savedProject.project.id) {
                projectId = savedProject.project.id;
                console.log('Found project ID in nested structure:', projectId);
            } else if (savedProject && savedProject.id) {
                projectId = savedProject.id;
                console.log('Found project ID in direct structure:', projectId);
            } else if (savedProject && typeof savedProject === 'object') {
                // Try to find ID in any nested object
                const findId = (obj) => {
                    if (obj && typeof obj === 'object') {
                        if (obj.id) return obj.id;
                        for (const key in obj) {
                            if (obj[key] && typeof obj[key] === 'object') {
                                const found = findId(obj[key]);
                                if (found) return found;
                            }
                        }
                    }
                    return null;
                };
                projectId = findId(savedProject);
                console.log('Found project ID by searching:', projectId);
            }

            if (projectId) {
                console.log('Redirecting to project:', projectId); // Debug logging
                navigate(`/projects/${projectId}`);
            } else {
                console.error('Error saving project - no valid response:', savedProject);
                console.error('Response type:', typeof savedProject);
                console.error('Response keys:', savedProject ? Object.keys(savedProject) : 'null/undefined');
                if (isNewProject) {
                    alert('Error al crear el proyecto. Por favor, verifica los datos e intenta nuevamente.');
                } else {
                    alert('Error al actualizar el proyecto. Por favor, verifica los datos e intenta nuevamente.');
                }
            }
        } catch (error) {
            console.error('Error saving project:', error);
            console.error('Error details:', error.message);
            if (isNewProject) {
                alert('Error al crear el proyecto. Por favor, verifica tu conexión e intenta nuevamente.');
            } else {
                alert('Error al actualizar el proyecto. Por favor, verifica tu conexión e intenta nuevamente.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (isNewProject) {
            navigate('/projects');
        } else {
            navigate(`/projects/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="btn btn-link d-flex align-items-center gap-2 text-muted p-0"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <h1 className="h1 fw-bold text-dark mb-0">
                        {isNewProject ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
                    </h1>
                </div>
                {saving && (
                    <div className="d-flex align-items-center gap-2 text-primary">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        Guardando...
                    </div>
                )}
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <ProjectForm
                        project={project}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditProjectPage;
