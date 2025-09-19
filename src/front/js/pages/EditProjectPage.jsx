import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '../component/project/ProjectForm.jsx';
import { ArrowLeft, Save } from 'lucide-react';

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isNewProject = id === 'new';

    useEffect(() => {
        if (!isNewProject) {
            fetchProject();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${id}`);
            if (response.ok) {
                const data = await response.json();
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
            const url = isNewProject ? '/api/projects' : `/api/projects/${id}`;
            const method = isNewProject ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedProject = await response.json();
                navigate(`/projects/${savedProject.id}`);
            } else {
                console.error('Error saving project');
                alert('Error al guardar el proyecto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el proyecto');
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isNewProject ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
                    </h1>
                </div>
                {saving && (
                    <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Guardando...
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <ProjectForm
                    project={project}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

export default EditProjectPage;
