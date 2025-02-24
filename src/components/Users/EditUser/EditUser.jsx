import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "./EditUser.css";

function EditUser() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para el modal
    const username = "hosting55370us";
    const password = "Nyjo lM7f CLor urrl ZCqh nlyW";
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `https://www.goldenshark.es/wp-json/api-custom/v1/users_info/${id}`,
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.post(
                `https://www.goldenshark.es/wp-json/api-custom/v1/users_info/edit/${id}`,
                {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
                {
                    auth: {
                        username,
                        password,
                    },
                }
            );
            setIsModalVisible(true); // Muestra el modal al guardar correctamente
        } catch (error) {
            console.error("Error updating user:", error);
            setError("No se pudo actualizar el usuario.");
        }
    };

    if (loading) {
        return (
            <div className="user-edit-loading">
                <div className="user-edit-alert">
                    <p>Cargando datos del usuario...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-user-container mt-5 text-center">
                <div className="edit-user-alert-error">Usuario no encontrado.</div>
                <button className="btn-regresar" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    return (
        <div className="edit-user-container mt-5">
            <div className="edit-user-card">
                <h1 className="edit-user-title">Detalles del Usuario</h1>
                <div className="user-content">
                    <p>
                        <strong>ID: </strong>{user.id}
                    </p>
                    <p>
                        <strong>Nombre: </strong> {user.first_name} <strong>Apellido: </strong> {user.last_name}
                    </p>
                    <p>
                        <strong>Username: </strong> {user.username}
                    </p>
                    <p>
                        <strong>Email: </strong> {user.email}
                    </p>
                </div>

                <div className="card-edit-body">
                    <form>
                        <div className="form-edit-info mb-3">
                            <label htmlFor="first_name" className="form-label">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                name="first_name"
                                value={user.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">
                                Apellido:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                value={user.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username (No editable):
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={user.username}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                    <div className="buttons-edit-body">
                        <button className="btn btn-secondary mx-1" onClick={() => navigate(-1)}>
                            <FaArrowLeft /> Volver
                        </button>
                        <button className="btn btn-success mx-1" onClick={handleSave}>
                            <FaSave /> Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {isModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Usuario actualizado exitosamente</h2>
                        <button className="btn btn-primary" onClick={() => navigate("/users")}>
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditUser;
