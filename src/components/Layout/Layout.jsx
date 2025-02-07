import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
    const navigate = useNavigate();

    // Recuperar el usuario logueado del localStorage
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedUser");
        navigate("/login"); // Redirige a la página de login
    };

    return (
        <div className="layout">
            {/* Menú lateral */}
            <aside className="sidebar">
                <h2>Menú</h2>
                <nav>
                    <ul>
                        <li>
                            <Link to="/userRoles">Usuarios y Roles</Link>
                        </li>
                        <li>
                            <Link to="/users">Usuarios</Link>
                        </li>
                        <li>
                            <Link to="/roles">Roles</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Contenido principal */}
            <div className="main">
                <header className="header">
                    <div className="header-content">
                        <span className="user-info">
                            Usuario: {loggedUser?.username || "Desconocido"}
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </header>
                <div className="main-content">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
