import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import ProjectCard from '../component/project/ProjectCard';

const ProjectsPage = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            await actions.fetchProjects();
            setLoading(false);
        };
        fetchProjects();
    }, []);

    const projects = store.projects;

    const getProjectStatus = (project) => {
        if (project.avance_real >= 100) return 'Completado';
        if (project.avance_real > 80) return 'Por Completar';
        return 'En Progreso';
    };

    const getCurrentPhase = (project) => {
        if (!project.phases || project.phases.length === 0) return 'Sin Fases';

        // Sort phases by name assuming they are named FASE I, FASE II, etc.
        const sortedPhases = project.phases.sort((a, b) => {
            const numA = parseInt(a.name.replace('FASE ', ''));
            const numB = parseInt(b.name.replace('FASE ', ''));
            return numA - numB;
        });

        // Find the last phase with activities that have progress
        for (let i = sortedPhases.length - 1; i >= 0; i--) {
            const phase = sortedPhases[i];
            if (phase.activities && phase.activities.some(activity => activity.avance_real > 0)) {
                return phase.name;
            }
        }

        // If no activities have progress, return the first phase
        return sortedPhases[0].name;
    };

    if (loading) {
        return <div className="text-center p-4">Cargando proyectos...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Proyectos</h1>
                <Link to="/create-project" className="btn btn-primary">
                    Crear Nuevo Proyecto
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center p-4">
                    <p>No hay proyectos disponibles.</p>
                    <Link to="/create-project" className="btn btn-primary">
                        Crear el primer proyecto
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
