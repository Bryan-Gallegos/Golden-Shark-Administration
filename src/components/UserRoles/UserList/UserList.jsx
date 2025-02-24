import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import roleLabels from "../../../utils/roleLabels"; // Importamos nombres amigables de roles
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]); // Usuarios originales
  const [filteredUsers, setFilteredUsers] = useState([]); // Usuarios filtrados
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]); // Lista de roles
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const username = "hosting55370us";
  const password = "Nyjo lM7f CLor urrl ZCqh nlyW";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole]); // Se ejecuta al cambiar la búsqueda o el filtro de roles

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://www.goldenshark.es/wp-json/api-custom/v1/users",
        {
          auth: { username, password },
        }
      );
      setUsers(response.data);
      setFilteredUsers(response.data);

      // Extraer todos los roles únicos
      const allRoles = new Set();
      response.data.forEach((user) => {
        user.roles.forEach((role) => allRoles.add(role));
      });
      setRoles(Array.from(allRoles));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole && selectedRole !== "Todos los Roles") {
      filtered = filtered.filter((user) => user.roles.includes(selectedRole));
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reinicia la paginación al cambiar filtros
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestión de Roles de Usuario</h1>
      <div className="search-bar d-flex align-items-center gap-3">
        {/* Búsqueda en tiempo real */}
        <input
          type="text"
          className="form-control"
          placeholder="Búsqueda por Nombre o correo"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filtro de roles que busca automáticamente */}
        <select
          className="form-control"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="Todos los Roles">📌 Todos los Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role] || role}
            </option>
          ))}
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">Cargando los usuarios...</td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No se encontraron coincidencias.</td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ backgroundColor: "#007bff", color: "#fff" }}
                    onClick={() => navigate(`view/id/${user?.id}`)}
                    title="Ver Usuario"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => navigate(`add_role/id/${user?.id}`)}
                    title="Agregar Rol"
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => navigate(`remove_role/id/${user?.id}`)}
                    title="Eliminar Rol"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      {filteredUsers.length > 0 && (
        <div className="pagination d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-secondary mx-1 ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;
