import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

                console.log('Token:', token);
                console.log('Refresh Token:', refresh_token);

                if (token && refresh_token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('refresh_token', refresh_token);

                    setSuccessMessage('Inicio de sesión exitoso!');
                    setError(null);

                    navigate('/estrenos');
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
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default Login;
