import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Estrenos from './pages/Estrenos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/estrenos" element={<Estrenos />} />
      </Routes>
    </Router>
  );
}

export default App;
