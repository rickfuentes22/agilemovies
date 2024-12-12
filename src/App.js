import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Estrenos from './pages/Estrenos';
import Navbar from './pages/Navbar';
import Popular from './pages/Popular';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/estrenos" element={<Estrenos />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/popular" element={<Popular />} />


      </Routes>
    </Router>
  );
}

export default App;
