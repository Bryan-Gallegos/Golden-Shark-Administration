import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import roleLabels from "../../../utils/roleLabels";
import protectedRoles from "../../../utils/protectedRoles";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./ListRole.css";

const ListRole = () => {
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10; // Número de roles por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "https://www.goldenshark.es/wp-json/custom-api/v1/roles",
          {
            auth: {
              username: "hosting55370us",
              password: "2AOr NmiY rQkn E83v z7Kv GDho",
            },
          }
        );

        // Actualizar roleLabels local con los datos obtenidos
        const updatedRoleLabels = {};
        response.data.forEach((role) => {
          updatedRoleLabels[role.key] = role.name || "Sin Nombre";
        });

        // Guardar en roleLabels dinámicamente
        Object.assign(roleLabels, updatedRoleLabels);

        setRoles(response.data);
      } catch (err) {
        console.error("Error al obtener roles:", err);
      } 
    };

    fetchRoles();
  }, []);

  // Calcular los roles de la página actual
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const isProtected = (roleKey) => protectedRoles.includes(roleKey);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestión de Roles</h1>
      <div className="add-role-container">
        <button
          className="btn btn-success"
          onClick={() => navigate("/roles/create")}
        >
          <FaPlus /> Agregar Nuevo Rol
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre Amigable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.length > 0 ? (
            currentRoles.map((role) => (
              <tr key={role.key}>
                <td>{role.key}</td>
                <td>{roleLabels[role.key] || "Sin Nombre"}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    style={{backgroundColor: '#007bff', color: 'white'}}
                    onClick={() => navigate(`/roles/view/${role.key}`)}
                    title="Ver Rol"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-eliminar"
                    disabled={protectedRoles[role.key]}
                    onClick={() => navigate(`/roles/remove/${role.key}`)}
                    title="Eliminar Rol"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                {loading ? "Cargando Roles ..." : "No se encontraron roles."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination d-flex justify-content-center mt-4">
        {Array.from(
          { length: Math.ceil(roles.length / rolesPerPage) },
          (_, i) => (
            <button
              key={i}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ListRole;
