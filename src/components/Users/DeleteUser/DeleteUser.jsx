import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import "./DeleteUser.css";

function DeleteUser() {
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const username = "hosting55370us";
  const password = "2AOr NmiY rQkn E83v z7Kv GDho";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://www.goldenshark.es/wp-json/custom-api/v1/users_info/${id}`,
        {
          auth: {
            username,
            password,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("No se pudo cargar la información del usuario.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://www.goldenshark.es/wp-json/custom-api/v1/users_info/delete/${id}`,
        {
          auth: {
            username,
            password,
          },
        }
      );
      setShowModal(true); // Muestra el modal después de eliminar
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("No se pudo eliminar el usuario.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/users"); // Redirige al listado de usuarios
  };

  return (
    <div className="delete-user-container">
      <div className="delete-user-card">
        <h1 className="delete-user-title">Eliminar Usuario</h1>
        {error ? (
          <p className="delete-user-error">{error}</p>
        ) : (
          <p>
            ¿Estás seguro que deseas eliminar al usuario{" "}
            <strong>{user?.first_name }</strong>{" "}
            <strong>{user?.last_name}</strong> con email{" "}
            <strong>{user?.email}</strong>?
          </p>
        )}
        <div className="buttons-delete-body">
          <button className="btn btn-secondary mx-1" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Cancelar
          </button>
          {!error && (
            <button className="btn btn-danger mx-1" onClick={handleDelete}>
              <FaTrash /> Eliminar Usuario
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Usuario Eliminado</h2>
            <p>El usuario ha sido eliminado exitosamente.</p>
            <button className="btn btn-primary" onClick={closeModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteUser;
