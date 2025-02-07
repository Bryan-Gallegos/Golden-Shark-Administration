import React, { useState } from "react";
import axios from "axios";
import "./CreateRole.css";
import { useNavigate } from "react-router-dom";
import { addRoleLabel } from "../../../utils/roleLabels"; // Asegúrate de que esta función esté correctamente implementada

const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const [friendlyName, setFriendlyName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim() || !friendlyName.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(
        "https://www.goldenshark.es/wp-json/custom-api/v1/roles/create",
        {
          key: roleName.trim(),
          friendlyName: friendlyName.trim(),
        },
        {
          auth: {
            username: "hosting55370us",
            password: "2AOr NmiY rQkn E83v z7Kv GDho",
          },
        }
      );

      if (response.status === 200) {
        // Agregar el rol dinámicamente
        addRoleLabel(roleName.trim(), friendlyName.trim());

        // Mostrar modal de éxito
        setSuccessMessage(`El rol "${friendlyName}" fue creado exitosamente.`);
        setShowModal(true);

        // Reiniciar inputs
        setRoleName("");
        setFriendlyName("");
      }
    } catch (error) {
      console.error("Error al crear el rol:", error);
      setErrorMessage("No se pudo crear el rol. Inténtalo nuevamente.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/roles"); // Redirigir al listado de roles
  };

  return (
    <div className="create-role-container">
      <h2>Crear Nuevo Rol</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roleName">Nombre del Rol (Clave):</label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Ejemplo: custom_role"
          />
        </div>
        <div className="form-group">
          <label htmlFor="friendlyName">Nombre Amigable:</label>
          <input
            type="text"
            id="friendlyName"
            value={friendlyName}
            onChange={(e) => setFriendlyName(e.target.value)}
            placeholder="Ejemplo: Rol Personalizado"
          />
        </div>
        <button type="submit" className="btn-create">
          Crear Rol
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rol Creado</h3>
            <p>El rol "<strong>{friendlyName}</strong>" fue creado exitosamente.</p>
            <button className="btn btn-success" onClick={closeModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRole;
