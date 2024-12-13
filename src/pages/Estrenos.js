import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

const Estrenos = () => {
    const [movies, setMovies] = useState([]);
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
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

    const handleMovieClick = (movieId) => {
        navigate(`/estrenodetalle/${movieId}`);
    };

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
                <h1 className="text-center mb-4">Películas en Estreno</h1>
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
                                            <div
                                                key={movie.id}
                                                className="col-3 d-flex justify-content-center"
                                                onClick={() => handleMovieClick(movie.id)}
                                            >
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
        </div>
    );
};

export default Estrenos;
