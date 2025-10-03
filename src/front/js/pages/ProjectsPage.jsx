import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import ProjectCard from '../component/project/ProjectCard.jsx';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const ProjectsPage = () => {
    const { store, actions } = useContext(Context);
    const currentUser = store.user;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await actions.fetchProjects();
            if (data) {
                setProjects(data);
            } else {
                toast.error('Error al obtener los proyectos');
            }
        } catch (error) {
            toast.error('Error al obtener los proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const handleCreateProject = () => {
        navigate('/new-project');
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
            try {
                const result = await actions.deleteProject(projectId);
                if (result.success) {
                    toast.success('Proyecto eliminado exitosamente');
                    // Refresh the projects list
                    fetchProjects();
                } else {
                    toast.error(result.message || 'Error al eliminar el proyecto');
                }
            } catch (error) {
                toast.error('Error al eliminar el proyecto');
            }
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || statusFilter === 'Todos' || project.status === statusFilter)
    );

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
                <h1 className="h2 fw-bold text-dark">Proyectos</h1>
                <button
                    onClick={handleCreateProject}
                    className="btn btn-primary d-flex align-items-center gap-2"
                >
                    <Plus size={20} />
                    Nuevo Proyecto
                </button>
            </div>

            <div className="mb-4 d-flex gap-3">
                <div className="input-group flex-fill">
                    <span className="input-group-text">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="input-group" style={{ width: '200px' }}>
                    <span className="input-group-text">Estado</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Todos</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Completado">Completado</option>
                        <option value="Retrasado">Retrasado</option>
                    </select>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-4">
                        <svg className="mx-auto" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="h4 fw-medium text-dark mb-3">No hay proyectos</h3>
                    <p className="text-muted mb-4">Comienza creando tu primer proyecto.</p>
                    <button
                        onClick={handleCreateProject}
                        className="btn btn-primary"
                    >
                        Crear Proyecto
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="col-12 col-md-6 col-lg-4">
                            <ProjectCard
                                project={project}
                                onViewDetails={handleViewDetails}
                                onDelete={handleDeleteProject}
                                currentUser={currentUser}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
