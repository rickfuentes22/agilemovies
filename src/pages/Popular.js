import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Popular = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch movies
    const fetchMovies = async (page) => {
        let token = localStorage.getItem('token');
        const refresh_token = localStorage.getItem('refresh_token');

        if (!token || !refresh_token) {
            setError('No se encontraron tokens válidos.');
            return;
        }

        const url = `http://161.35.140.236:9005/api/movies/popular?page=${page}`;

        try {
            setLoading(true);
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
                setMovies((prevMovies) => [...prevMovies, ...data.data]);
                setImageBaseUrl(data.imageBaseUrl);

                if (data.data.length === 0) {
                    setHasMore(false);
                }
            } else {
                setError('No se recibieron películas.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and subsequent pages
    useEffect(() => {
        fetchMovies(page);
    }, [page]);

    // Handle infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore) return;

            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            // Cargar más películas solo cuando llegues al final exacto de la página
            if (scrollTop + clientHeight >= scrollHeight) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Películas Populares</h1>

            {error && <p className="text-danger text-center">Error: {error}</p>}

            {movies.length > 0 ? (
                <div className="row g-4">
                    {movies.map((movie) => (
                        <div key={movie.id} className="col-6 col-md-4 col-lg-3">
                            <div className="card h-100 text-center">
                                <img
                                    src={`${imageBaseUrl}${movie.poster_path}`}
                                    className="card-img-top"
                                    alt={movie.title}
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Cargando películas...</p>
            )}

            {loading && <div className="text-center mt-4"><p>Cargando más...</p></div>}

            {!hasMore && <div className="text-center mt-4"><p>No hay más películas para mostrar.</p></div>}
        </div>
    );
};

export default Popular;
