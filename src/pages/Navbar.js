import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../styles/Navbar.css";

const Navbar = () => {
    const [isTransparent] = useState(true);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch("http://161.35.140.236:9005/api/user/me", {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const data = await response.json();
                    setUser(data.data);
                } catch (error) {
                    console.error("Error al obtener la información del usuario:", error);
                }
            };

            fetchUserData();
        }
    }, [token]);

    return (
        <div className="navnav">
            <div className="navbar-wrapper">
                <nav className={`navbar navbar-expand-lg fixed-top ${isTransparent ? "navbar-dark bg-dark navbar-opaque" : "navbar-dark bg-dark"}`}>
                    <div className="container-fluid">
                        <a className="navbar-brand">
                            AGILEMOVIES
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            {user && (
                                <span className="ms-auto text-white">
                                    Hola, {user.firstName} {user.lastName}
                                </span>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
