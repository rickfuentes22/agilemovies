import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import '../styles/EstrenoDetalle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PopularDetalle = () => {
    const [movie, setMovie] = useState(null);
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    const [actors, setActors] = useState([]);
    const [actorsBaseUrl, setActorsBaseUrl] = useState('');
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

    useEffect(() => {
        const fetchActors = async () => {
            let token = localStorage.getItem('token');
            const url = `http://161.35.140.236:9005/api/movies/${id}/actors`;

            try {
                let response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (data && data.data && data.imageBaseUrl) {
                    setActors(data.data);
                    setActorsBaseUrl(data.imageBaseUrl);
                } else {
                    setError('No se recibieron actores.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchActors();
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

                <h2 className="mt-5">Reparto</h2>
                <div id="actorsCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {actors.map((actor, index) => (
                            index % 4 === 0 ? (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="row text-center">
                                        {actors.slice(index, index + 4).map(actor => (
                                            <div key={actor.id} className="col-3">
                                                <img
                                                    src={`${actorsBaseUrl}${actor.profile_path}`}
                                                    alt={actor.name}
                                                    className="rounded-circle"
                                                    style={{ height: '150px', width: '150px', objectFit: 'cover', margin: 'auto' }}
                                                />
                                                <p style={{ marginTop: '10px', fontSize: '1rem' }}>{actor.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#actorsCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#actorsCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopularDetalle;
