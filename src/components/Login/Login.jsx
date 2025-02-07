import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import users from "../../data/users.json";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateFields = () => {
        if (!username || !password) {
            setErrorMessage("Por favor, completa todos los campos");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!validateFields()) return;

        setIsSubmitting(true);
        const user = users.find(
            (u) => u.username === username && u.password === password
        );
        if (user) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("loggedUser", JSON.stringify(user));
            navigate("/"); // Redirige a la página principal
        } else {
            setErrorMessage("Usuario o contraseña incorrectos");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingrese su usuario"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Procesando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
