import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from '../component/project/ProjectForm';

const EditProjectPage = () => {
    const { id } = useParams();

    return <ProjectForm projectId={id} />;
};

export default EditProjectPage;
