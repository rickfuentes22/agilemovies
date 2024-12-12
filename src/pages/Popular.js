import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const Popular = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    useEffect(() => {
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
                } else {
                    setError('No se recibieron películas.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies(page);

        const handleScroll = () => {
            const bottom = Math.floor(document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight);
            if (bottom && !loading) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading]);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Películas Populares</h1>

            {error && <p className="text-danger text-center">Error: {error}</p>}

            {movies.length > 0 ? (
                <div className="row">
                    {movies.map((movie, index) => (
                        <div key={movie.id} className="col-3 mb-4 d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <img
                                    src={`${imageBaseUrl}${movie.poster_path}`}
                                    className="w-50"
                                    alt={movie.title}
                                />
                                <p className="mt-2 text-center">{movie.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Cargando películas...</p>
            )}

            {loading && <div className="text-center mt-4"><p>Cargando más...</p></div>}
        </div>
    );
};

export default Popular;
