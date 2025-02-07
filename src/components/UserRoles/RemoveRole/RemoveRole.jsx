import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels from "../../../utils/roleLabels"; // Importa los nombres amigables de roles
import "./RemoveRole.css";

function RemoveRole() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = "hosting55370us";
  const password = "2AOr NmiY rQkn E83v z7Kv GDho";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.goldenshark.es/wp-json/custom-api/v1/user/${id}`,
          {
            auth: {
              username,
              password,
            },
          }
        );
        const roles = response.data.roles || [];
        setUser(response.data);
        setUserRoles(roles);
      } catch (err) {
        console.error("Error al obtener los detalles del usuario:", err);
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleRemoveRole = async (role) => {
    try {
      await axios.post(
        "https://www.goldenshark.es/wp-json/custom-api/v1/user/remove-role",
        {
          id: id,
          role: role,
        },
        {
          auth: {
            username,
            password,
          },
        }
      );
      setModalMessage(
        `Rol "${roleLabels[role] || role}" eliminado correctamente del usuario.`
      );
      setUserRoles(userRoles.filter((r) => r !== role));
      setShowModal(true);
      setError(null);
    } catch (err) {
      console.error("Error al eliminar el rol:", err);
      setError("No se pudo eliminar el rol. Verifica la conexión y los permisos.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1); // Regresar después de cerrar el modal
  };

  if (loading) {
    return (
      <div className="remove-role-loading">
        <div className="remove-role-alert">Cargando detalles del usuario...</div>
      </div>
    );
  }

  return (
    <div className="remove-role-container">
      <h2 className="title">Eliminar Rol del Usuario</h2>
      {error && <div className="alert error">{error}</div>}

      {user ? (
        <div className="titles">
          <p><strong>ID del usuario:</strong> {user.id}</p>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Correo:</strong> {user.email}</p>

          <div className="roles-list">
            <h3>Roles actuales:</h3>
            {userRoles.length > 0 ? (
              userRoles.map((role, index) => (
                <div key={index} className="role-item">
                  <span className="role-label">{roleLabels[role] || role}</span>
                  <button
                    onClick={() => handleRemoveRole(role)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay roles asignados al usuario.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="alert error">No se encontró información del usuario.</div>
      )}

      <button onClick={() => navigate(-1)} className="btn-regresar">
        Volver
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmación</h3>
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal} className="btn-cerrar">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemoveRole;
