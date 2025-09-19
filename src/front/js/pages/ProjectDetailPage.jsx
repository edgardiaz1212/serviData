import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectProgressChart from '../component/project/ProjectProgressChart.jsx';
import { ArrowLeft, Edit, Plus, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id && id !== 'new') {
            fetchProject();
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

    const handleEdit = () => {
        navigate(`/projects/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/projects');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'En progreso':
                return <Clock className="text-blue-500" size={20} />;
            case 'Completado':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'Retrasado':
                return <AlertTriangle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getDeviationColor = (deviation) => {
        if (deviation < -10) return 'text-red-600 bg-red-50';
        if (deviation > 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Proyecto no encontrado</h3>
                <button
                    onClick={handleBack}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Volver a Proyectos
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                </div>
                <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Edit size={20} />
                    Editar
                </button>
            </div>

            {/* Project Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Estado</p>
                            <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(project.status)}
                                <p className="text-lg font-semibold">{project.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Duración Total</p>
                            <p className="text-2xl font-bold text-gray-900">{project.total_duration} días</p>
                        </div>
                        <Clock className="text-gray-400" size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Fases</p>
                            <p className="text-2xl font-bold text-gray-900">{project.num_phases}</p>
                        </div>
                        <TrendingUp className="text-gray-400" size={24} />
                    </div>
                </div>

                <div className={`p-6 rounded-lg shadow-md ${getDeviationColor(project.accumulated_deviation || 0)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Desviación Acumulada</p>
                            <p className="text-2xl font-bold">{(project.accumulated_deviation || 0).toFixed(2)}%</p>
                        </div>
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                    {['overview', 'phases', 'activities', 'chart', 'attention'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab === 'overview' && 'Resumen'}
                            {tab === 'phases' && 'Fases'}
                            {tab === 'activities' && 'Actividades'}
                            {tab === 'chart' && 'Gráfico de Progreso'}
                            {tab === 'attention' && 'Puntos de Atención'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Información General</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">EDT:</span> {project.edt_structure}</p>
                                    <p><span className="font-medium">Inicio:</span> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definido'}</p>
                                    <p><span className="font-medium">Fin:</span> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No definido'}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Indicadores</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Progreso Planificado:</span> {project.planned_progress || 0}%</p>
                                    <p><span className="font-medium">Progreso Real:</span> {project.real_progress || 0}%</p>
                                    <p><span className="font-medium">Cumplimiento:</span> {project.compliance || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'phases' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Fases del Proyecto</h3>
                        <div className="space-y-4">
                            {project.phases && project.phases.map((phase, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-md font-medium">{phase.name}</h4>
                                        <span className="text-sm text-gray-500">Orden: {phase.order}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <p><span className="font-medium">Duración:</span> {phase.duration} días</p>
                                        <p><span className="font-medium">Inicio:</span> {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : 'No definido'}</p>
                                        <p><span className="font-medium">Fin:</span> {phase.end_date ? new Date(phase.end_date).toLocaleDateString() : 'No definido'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'activities' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Actividades</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planificado %</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Real %</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desviación</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {project.phases && project.phases.flatMap(phase =>
                                        phase.activities ? phase.activities.map((activity, index) => (
                                            <tr key={`${phase.id}-${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {activity.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {phase.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {activity.duration} días
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {activity.planned_percent || 0}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {activity.real_percent || 0}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {activity.deviation ? activity.deviation.toFixed(2) : 0}%
                                                </td>
                                            </tr>
                                        )) : []
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'chart' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Gráfico de Progreso (Curva S)</h3>
                        <ProjectProgressChart project={project} />
                    </div>
                )}

                {activeTab === 'attention' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Puntos de Atención</h3>
                        <div className="space-y-4">
                            {/* Placeholder for attention points table */}
                            <div className="text-center py-8 text-gray-500">
                                <AlertTriangle size={48} className="mx-auto mb-4" />
                                <p>No hay puntos de atención registrados</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailPage;
