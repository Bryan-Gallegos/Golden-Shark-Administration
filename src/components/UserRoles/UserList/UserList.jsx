import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 13; // Define cuántos usuarios por página
  const username = "hosting55370us";
  const password = "2AOr NmiY rQkn E83v z7Kv GDho";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://www.goldenshark.es/wp-json/custom-api/v1/users",
        {
          auth: {
            username,
            password,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filtered);
  };

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
      <h1 className="text-center">Gestión de Roles de Usuario</h1>
      <div className="search-bar">
        <input
          type="text"
          className="form-control "
          placeholder="Búsqueda de Usuario por ID, nombre o correo"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "35%" }}>Nombre</th>
            <th style={{ width: "40%" }}>Email</th>
            <th style={{ width: "15%" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ backgroundColor: '#007bff', color: '#fff' }} // Azul personalizado
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
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Cargando Usuarios .....
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="pagination d-flex justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn btn-secondary mx-1 ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;
