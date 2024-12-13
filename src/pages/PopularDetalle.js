import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import "../styles/EstrenoDetalle.css";


const PopularDetalle = () => {
    const [movie, setMovie] = useState(null);
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPopularDetalle = async () => {
            let token = localStorage.getItem('token');
            const url = `http://161.35.140.236:9005/api/movies/popular`;

            try {
                let response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (data && data.data && data.imageBaseUrl) {
                    setImageBaseUrl(data.imageBaseUrl);
                    const popularDetalle = data.data.find(movie => movie.id.toString() === id);

                    if (popularDetalle) {
                        setMovie(popularDetalle);
                    } else {
                        setError('Película no encontrada.');
                    }
                } else {
                    setError('No se recibieron películas.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPopularDetalle();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!movie) {
        return <div>Cargando detalles de la película...</div>;
    }

    return (
        <div style={{ marginTop: '67px' }}>
            <Navbar />
            <div className="container mt-5">
                <h1>{movie.title}</h1>

                {movie.backdrop_path && (
                    <div
                        style={{
                            backgroundImage: `url(${imageBaseUrl}${movie.backdrop_path})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '400px',
                            marginBottom: '20px',
                        }}
                    >
                    </div>
                )}

                <div className="movie-details">
                    <img
                        src={`${imageBaseUrl}${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                    />

                    <div className="movie-overview">
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularDetalle;