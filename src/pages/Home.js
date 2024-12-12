import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import Popular from "./Popular";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [imageBaseUrl, setImageBaseUrl] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            let token = localStorage.getItem('token');
            const refresh_token = localStorage.getItem('refresh_token');

            if (!token || !refresh_token) {
                setError('No se encontraron tokens válidos.');
                return;
            }

            const url = `http://161.35.140.236:9005/api/movies/now_playing`;

            try {
                let response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 401) {
                    const refreshResponse = await fetch('http://161.35.140.236:9005/api/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh_token }),
                    });

                    if (!refreshResponse.ok) throw new Error('Error al renovar el token');

                    const refreshData = await refreshResponse.json();
                    token = refreshData.token;
                    localStorage.setItem('token', token);

                    response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                }

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (data && data.data && data.imageBaseUrl) {
                    setMovies(data.data);
                    setImageBaseUrl(data.imageBaseUrl);
                } else {
                    setError('No se recibieron películas.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovies();
    }, []);

    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const movieChunks = chunkArray(movies, 4);

    return (
        <div style={{ marginTop: '67px' }}>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4 ">Películas en Estreno</h1>

                {error && <p className="text-danger text-center">Error: {error}</p>}

                {movies.length > 0 ? (
                    <div
                        id="moviesCarousel"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        data-bs-interval="3000"
                    >
                        <div className="carousel-inner">
                            {movieChunks.map((chunk, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                >
                                    <div className="row">
                                        {chunk.map((movie) => (
                                            <div key={movie.id} className="col-3 d-flex justify-content-center">
                                                <img
                                                    src={`${imageBaseUrl}${movie.poster_path}`}
                                                    className="w-50"
                                                    alt={movie.title}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#moviesCarousel"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#moviesCarousel"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                ) : (
                    <p className="text-center">Cargando películas...</p>
                )}
            </div>
            <div style={{ marginTop: '67px' }}>
                <Popular />
            </div>


        </div>


    );
};

export default Home;
