import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels, { addRoleLabel } from "../../../utils/roleLabels";
import "./EditRole.css";

const EditRole = () => {
  const { key } = useParams();
  const [newName, setNewName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEdit = async () => {
    try {
      const response = await axios.post(
        "https://www.goldenshark.es/wp-json/api-custom/v1/role/edit",
        {
          key,
          name: newName.trim(),
        },
        {
          auth: {
            username: "hosting55370us",
            password: "Nyjo lM7f CLor urrl ZCqh nlyW",
          },
        }
      );

      if (response.status === 200) {
        // Actualiza localmente el nombre del rol
        addRoleLabel(key, newName.trim());

        // Configura el mensaje de éxito y muestra el modal
        setMessage(`El rol "${key}" fue actualizado correctamente a "${newName}".`);
        setShowConfirmModal(true);
      }
    } catch (err) {
      console.error("Error al editar el rol:", err);
      setMessage("Error al actualizar el nombre del rol. Inténtalo nuevamente.");
      setShowConfirmModal(true);
    }
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    navigate("/roles"); // Redirigir al listado de roles
  };

  return (
    <div className="edit-role-container">
      <h2>Editar Rol</h2>
      <p>
        <strong>Rol Actual:</strong> {roleLabels[key] || key}
      </p>
      <div className="form-group">
        <label htmlFor="newName">Nuevo Nombre:</label>
        <input
          id="newName"
          type="text"
          placeholder="Ingrese el nuevo nombre amigable"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleEdit}>
          Guardar Cambios
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resultado</h3>
            <p>{message}</p>
            <button className="btn btn-success" onClick={closeModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRole;
