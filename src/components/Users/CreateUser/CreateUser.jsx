import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "./CreateUser.css";

function CreateUser() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal de confirmación
    const username = "hosting55370us";
    const password = "Nyjo lM7f CLor urrl ZCqh nlyW";
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            // Validación simple de campos requeridos
            if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.password) {
                setError("Todos los campos son obligatorios.");
                return;
            }

            await axios.post(
                `https://www.goldenshark.es/wp-json/api-custom/v1/users_info/create`,
                {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: "subscriber", // Rol predeterminado
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
            console.error("Error creating user:", error);
            setError("No se pudo crear el usuario. Intente nuevamente.");
        }
    };

    return (
        <div className="create-user-container mt-5">
            <div className="create-user-card">
                <h1 className="create-user-title">Crear Nuevo Usuario</h1>
                <div className="card-create-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="first_name" className="form-label">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="last_name" className="form-label">
                                Apellido:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="username" className="form-label">
                                Username:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña:
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                    <div className="buttons-create-body">
                        <button className="btn btn-secondary mx-1" onClick={() => navigate(-1)}>
                            <FaArrowLeft /> Volver
                        </button>
                        <button className="btn btn-success mx-1" onClick={handleSave}>
                            <FaSave /> Crear Usuario
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {isModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Usuario creado exitosamente</h2>
                        <button className="btn btn-primary" onClick={() => navigate("/users")}>
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateUser;
