import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://161.35.140.236:9005/api/auth/login', {
                username,
                password,
            });

            const data = response.data;

            if (data && data.data && data.data.payload) {
                const { token, refresh_token } = data.data.payload;

                if (token && refresh_token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('refresh_token', refresh_token);

                    setSuccessMessage('Inicio de sesión exitoso!');
                    setError(null);

                    navigate('/home');
                } else {
                    throw new Error('No se recibió el token o el refresh_token.');
                }
            } else {
                throw new Error('Respuesta de la API no contiene los datos esperados.');
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Iniciar Sesión</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>

                {error && <p className="error-message">Error: {error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>
    );
};

export default Login;
