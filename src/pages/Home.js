import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import Popular from "./Popular";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Estrenos from './Estrenos';

const Home = () => {



    return (
        <div style={{ marginTop: '67px' }}>
            <Navbar />

            <div style={{ marginTop: '67px' }}>
                <Estrenos />
            </div>
            <div style={{ marginTop: '67px' }}>
                <Popular />
            </div>


        </div>


    );
};

export default Home;
