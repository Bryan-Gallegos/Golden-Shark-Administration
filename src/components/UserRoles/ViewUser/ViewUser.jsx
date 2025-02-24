import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewUser.css";
import roleLabels from "../../../utils/roleLabels";
import { FaArrowLeft } from "react-icons/fa";

function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = "hosting55370us";
  const password = "Nyjo lM7f CLor urrl ZCqh nlyW";

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://www.goldenshark.es/wp-json/api-custom/v1/user/${id}`,
        {
          auth: {
            username,
            password,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegresar = () => {
    navigate(-1); // Regresa a la página anterior
  };

  if (loading) {
    return (
      <div className="view-user-loading">
        <div className="view-user-alert">Cargando detalles del usuario...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="view-user-container">
        <div className="view-user-alert-error">Usuario no encontrado.</div>
        <button onClick={handleRegresar} className="btn-regresar">
        <FaArrowLeft /> Volver
        </button>
      </div>
    );
  }

  // Manejo de roles si son un array o un string
  const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];

  return (
    <div className="view-user-container">
      <div className="view-user-card">
        <h2 className="view-user-title">Detalles del Usuario</h2>
        <div className="view-user-content">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Lista de roles en formato estilizado */}
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
        </div>
        <button className="btn-regresar" onClick={handleRegresar}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default ViewUser;
