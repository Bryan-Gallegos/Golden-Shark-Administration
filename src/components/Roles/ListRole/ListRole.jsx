import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels from "../../../utils/roleLabels";
import protectedRoles from "../../../utils/protectedRoles";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import "./ListRole.css";

const ListRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10; // Número de roles por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "https://www.goldenshark.es/wp-json/api-custom/v1/roles",
          {
            auth: {
              username: "hosting55370us",
              password: "Nyjo lM7f CLor urrl ZCqh nlyW",
            },
          }
        );

        // Si la respuesta no es un array, evita errores
        if (!Array.isArray(response.data)) {
          console.error("Error: La API devolvió un formato inesperado.", response.data);
          return;
        }

        // Guardamos roles con su cantidad de usuarios
        setRoles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener roles:", err);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Función para verificar si un rol es protegido
  const isProtected = (roleKey) => {
    return Array.isArray(protectedRoles) && protectedRoles.includes(roleKey);
  };

  // Calcular los roles de la página actual
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestión de Roles</h1>
      <div className="add-role-container">
        <button className="btn btn-success" onClick={() => navigate("/roles/create")}>
          <FaPlus /> Agregar Nuevo Rol
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre Amigable</th>
            <th>N° de Usuarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">Cargando Roles...</td>
            </tr>
          ) : currentRoles.length > 0 ? (
            currentRoles.map((role) => (
              <tr key={role.key}>
                <td>{role.key}</td>
                <td>{roleLabels[role.key] || role.name || "Sin Nombre"}</td>
                <td>
                  {role.user_count === 0
                    ? "0 usuarios"
                    : role.user_count === 1
                      ? "1 usuario"
                      : `${role.user_count} usuarios`}
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={() => navigate(`/roles/view/${role.key}`)}
                    title="Ver Rol"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => navigate(`/roles/remove/${role.key}`)}
                    title="Eliminar Rol"
                    disabled={isProtected(role.key)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No se encontraron roles.</td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Paginación */}
      <div className="pagination d-flex justify-content-center mt-4">
        {Array.from({ length: Math.ceil(roles.length / rolesPerPage) }, (_, i) => (
          <button
            key={i}
            className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListRole;
