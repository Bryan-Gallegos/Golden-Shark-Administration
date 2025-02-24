import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels from "../../../utils/roleLabels";
import "./ViewRole.css";

const ViewRole = () => {
  const { key } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `https://www.goldenshark.es/wp-json/api-custom/v1/role/${key}`,
          {
            auth: {
              username: "hosting55370us",
              password: "Nyjo lM7f CLor urrl ZCqh nlyW",
            },
          }
        );
        setRole(response.data);
      } catch (err) {
        console.error("Error al obtener el rol:", err);
        setErrorMessage("Error al cargar los detalles del rol.");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [key]);

  if (loading) {
    return (
      <div className="view-role-loading">
        <div className="view-role-alert">Cargando detalles del rol...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="view-role-container">
        <div className="view-role-alert-error">
          <p>{errorMessage}</p>
          <button onClick={() => navigate(-1)} className="btn-regresar">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-role-container">
      <div className="view-role-card">
        <h2 className="view-role-title">Detalles del Rol</h2>
        {role ? (
          <div className="view-role-content">
            <p>
              <strong>Rol (Clave):</strong> {role.key}
            </p>
            <p>
              <strong>Nombre Amigable:</strong> {roleLabels[role.key] || "Sin Nombre"}
            </p>
            <p>
              <strong>Usuarios Asociados:</strong>{" "}
              {role.user_count === 0
                ? "0 usuarios"
                : role.user_count === 1
                ? "1 usuario"
                : `${role.user_count} usuarios`}
            </p>
          </div>
        ) : (
          <p>Rol no encontrado.</p>
        )}
        <button className="btn-regresar" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default ViewRole;
