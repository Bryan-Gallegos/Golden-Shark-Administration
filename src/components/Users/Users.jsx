import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import "./Users.css";

function Users() {
  const [allUsers, setAllUsers] = useState([]); // Mantiene todos los usuarios
  const [users, setUsers] = useState([]); // Usuarios mostrados en la tabla
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const username = "hosting55370us";
  const password = "Nyjo lM7f CLor urrl ZCqh nlyW";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://www.goldenshark.es/wp-json/api-custom/v1/users_info', {
        auth: { username, password },
      });

      // Verificar que la respuesta es JSON
      if (response.headers['content-type'].includes('application/json')) {
        setAllUsers(response.data);
        setUsers(response.data);
      } else {
        console.error("La API devolvió un formato inesperado", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  // Filtrado automático al escribir en el campo de búsqueda
  useEffect(() => {
    if (!searchQuery) {
      setUsers(allUsers);
      setCurrentPage(1);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, allUsers]);

  // Cálculo para la paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestión de Usuarios</h1>

      <div className="search-bar d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Búsqueda de Usuario por ID, nombre o correo"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-success btn-sm"
          onClick={() => navigate("create")}
          style={{ backgroundColor: "green", color: "#fff" }}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Username</th>
            <th>Email</th>
            <th>N° Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roles?.length || "N/A"}</td>
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
                    className="btn btn-info btn-sm mx-1"
                    onClick={() => navigate(`edit/id/${user?.id}`)}
                    title="Editar Usuario"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => navigate(`delete/id/${user?.id}`)}
                    title="Eliminar Usuario"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Cargando Usuarios...
              </td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Paginación */}
      {users.length > 0 && (
        <div className="pagination d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-secondary mx-1 ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
