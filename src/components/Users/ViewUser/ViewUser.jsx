import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "./ViewUser.css";
import roleLabels from "../../../utils/roleLabels";

function ViewUser() {
    const { id } = useParams(); // Obtiene el ID del usuario desde la URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = "hosting55370us";
    const password = "2AOr NmiY rQkn E83v z7Kv GDho";
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `https://www.goldenshark.es/wp-json/custom-api/v1/users_info/${id}`,
                {
                    auth: {
                        username,
                        password,
                    },
                }
            );
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("No se pudo cargar la información del usuario.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="user-view-loading">
                <div className="user-view-alert">
                    <p>Cargando datos del usuario...</p>
                </div>
            </div>

        );
    }

    if (error) {
        return (
            <div className="view-user-container mt-5 text-center">
                <div className="view-user-alert-error">Usuario no encontrado.</div>
                <button className="btn-regresar" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];

    return (
        <div className="view-user-container mt-5">
            <div className="view-user-card">
                <h1 className="view-user-title">Detalles del Usuario</h1>
                <div className="view-user-content">
                    <p>
                        <strong>ID: </strong>{user.id}
                    </p>
                    <p>
                        <strong>Nombre: </strong> {user.first_name}
                    </p>
                    <p>
                        <strong>Apellido: </strong> {user.last_name}
                    </p>
                    <p>
                        <strong>Username: </strong> {user.username}
                    </p>
                    <p>
                        <strong>Email: </strong> {user.email}
                    </p>
                    <p></p>
                    <div className="current-roles">
                        <h3>Roles:</h3>
                        {rolesArray.length > 0 ? (
                            <ul className="roles-list">
                                {rolesArray.map((role, index) => (
                                    <li key={index} className="role-item">
                                        {roleLabels[role] || role}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>El usuario no tiene roles asignados.</p>
                        )}
                    </div>
                    <button className="btn btn-regresar" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Volver
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ViewUser;
