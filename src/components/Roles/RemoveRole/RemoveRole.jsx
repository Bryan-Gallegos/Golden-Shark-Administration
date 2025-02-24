import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels from "../../../utils/roleLabels";
import "./RemoveRole.css";

const RemoveRole = () => {
  const { key } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(true); // Controla el modal de confirmación
  const [showMessageModal, setShowMessageModal] = useState(false); // Controla el modal del resultado
  const [message, setMessage] = useState(""); // Mensaje de resultado
  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      await axios.post(
        "https://www.goldenshark.es/wp-json/api-custom/v1/role/delete",
        { key },
        {
          auth: {
            username: "hosting55370us",
            password: "Nyjo lM7f CLor urrl ZCqh nlyW",
          },
        }
      );

      // Mensaje de éxito
      setMessage(`El rol "${roleLabels[key] || key}" fue eliminado correctamente.`);
      setShowConfirmModal(false);
      setShowMessageModal(true);
    } catch (err) {
      console.error("Error al eliminar el rol:", err);

      // Mensaje de error
      setMessage("Error al eliminar el rol. Inténtalo nuevamente.");
      setShowConfirmModal(false);
      setShowMessageModal(true);
    }
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    navigate("/roles"); // Redirige al listado de roles
  };

  return (
    <>
      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Eliminar Rol</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el rol{" "}
              <strong>{roleLabels[key] || key}</strong>?
            </p>
            <div className="modal-actions">
              <button 
              className="btn btn-danger" 
              style={{backgroundColor:'red'}}
              onClick={handleRemove}>
                Eliminar
              </button>
              <button 
              className="btn btn-secondary"
              style={{backgroundColor:'#555'}}
              onClick={() => navigate(-1)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mensaje de resultado */}
      {showMessageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resultado</h3>
            <p>{message}</p>
            <button className="btn btn-success" onClick={closeMessageModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RemoveRole;
