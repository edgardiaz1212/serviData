import React from "react";

const ServiceCard = ({ service, onClick }) => {
    const renderServiceDetail = (label, value) => {
        if (!value || value === 0) return null;
        return (
            <p>
                <strong>{label}:</strong> {value}
            </p>
        );
    };

    return (
        <div
            className="list-group-item list-group-item-action"
            onClick={onClick}
        >
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{service.tipo_servicio || "Servicio"}</h5>
            </div>
            <div className="d-flex justify-content-between">
                {/* Renderizar detalles del servicio */}
                {renderServiceDetail("Dominio", service.dominio)}
                {renderServiceDetail("Estado", service.estado)}
                {renderServiceDetail("RAM", service.ram)}
                {/* Agrega más detalles según sea necesario */}
            </div>
        </div>
    );
};

export default ServiceCard;