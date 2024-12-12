import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Estrenos from './pages/Estrenos';
import Home from './pages/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/estrenos" element={<Estrenos />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
