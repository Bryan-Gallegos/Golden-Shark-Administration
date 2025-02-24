import React from "react";
import { Link } from "react-router-dom"; // Importa Link para los enlaces
import "./Home.css"; // Archivo CSS para los estilos
import logo from "../../assets/logo_golden_shark.png"; // Ruta del logo

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <img src={logo} alt="Golden Shark Logo" className="home-logo" />
        <h1>Bienvenido al Área de Administración de Golden Shark</h1>
        <p>
          Esta aplicación está diseñada para facilitar la gestión y administración de:
        </p>
        <ul className="home-list">
          <li>
            <Link to="/users" className="home-link"><strong>Gestión de Usuarios</strong></Link> - Visualiza y administra los usuarios de la web de Golden Shark.
          </li>
          <li>
            <Link to="/roles" className="home-link"><strong>Gestión de Roles</strong></Link> - Configura y administra los roles disponibles en la web de Golden Shark.
          </li>
          <li>
            <Link to="/userRoles" className="home-link"><strong>Roles de Usuarios</strong></Link> - Asigna y gestiona los roles específicos de cada usuario.
          </li>
        </ul>
        <p>
          Utiliza el menú para explorar y administrar estas funciones de manera eficiente.
        </p>
      </div>
    </div>
  );
};

export default Home;
