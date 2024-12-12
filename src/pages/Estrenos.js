import React, { useEffect, useState } from 'react';

const Estrenos = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [imageBaseUrl, setImageBaseUrl] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            let token = localStorage.getItem('token');
            const refresh_token = localStorage.getItem('refresh_token');

            if (!token || !refresh_token) {
                setError('No se encontraron tokens válidos.');
                return;
            }

            const url = `http://161.35.140.236:9005/api/movies/now_playing?page=${page}`;

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
    }, [page]);

    const handleNextPage = () => setPage((prevPage) => prevPage + 1);
    const handlePreviousPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

    return (
        <div>
            <h1>Películas en Cartelera</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {movies && movies.length > 0 ? (
                    movies.map((movie) => (
                        <li key={movie.id}>
                            <h3>{movie.title}</h3>
                            <p>{movie.overview}</p>
                            <img
                                src={`${imageBaseUrl}${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </li>
                    ))
                ) : (
                    <p>No hay películas disponibles.</p>
                )}
            </ul>

            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>Anterior</button>
                <span>Página {page}</span>
                <button onClick={handleNextPage}>Siguiente</button>
            </div>
        </div>
    );
};

export default Estrenos;
